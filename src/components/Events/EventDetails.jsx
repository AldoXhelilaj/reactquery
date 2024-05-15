import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import Header from '../Header.jsx';
import { deleteEvent, getSingleEvent } from '../../util/http.js';
import { useParams } from 'react-router-dom';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { queryClient } from '../../util/http.js';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isError, error } = useQuery({
    queryKey: ['event-details', id],
    queryFn: ({ signal }) => getSingleEvent({ signal, id })
  })

  const { mutate } = useMutation({
    mutationFn: ({ id }) => deleteEvent({ id }),

    onSuccess: () => {
      navigate('../')
      queryClient.invalidateQueries({ queryKey: ['events'],
    refetchType: 'none' })
    }
  })

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {isError && <ErrorBlock title="Error" message={error.message} />}
      {data &&
        <article id="event-details">
          <header>
            <h1>{data.title}</h1>
            <nav>
              <button onClick={() => mutate({ id })}>Delete</button>
              <Link to="edit">Edit</Link>
            </nav>
          </header>
          <div id="event-details-content">
            <img src={`http://localhost:3000/${data.image}`} id="event-details-img" alt={data.title} />
            <div id="event-details-info">
              <div>
                <p id="event-details-location">{data.location}</p>
                <time dateTime={`Todo-DateT$Todo-Time`}>{formatDate(data.date) +'@' + data.time}</time>
              </div>
              <p id="event-details-description">{data.description}</p>
            </div>
          </div>
        </article>}

    </>
  );
}
