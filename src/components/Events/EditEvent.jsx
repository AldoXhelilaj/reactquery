import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { updateEvent } from '../../util/http.js';
import { getSingleEvent } from '../../util/http.js';
import { queryClient } from '../../util/http.js';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: event, isPending } = useQuery({
    queryKey: ['event', id],
    queryFn: () => getSingleEvent({ id })
  })
  const { mutate } = useMutation({
    mutationFn:  updateEvent,
    onMutate: () => {
    queryClient.invalidateQueries({ queryKey: ['event'] })
    },


  })

  function handleSubmit(formData) {
    mutate({ id ,event: formData })
    navigate('../')

  }

  function handleClose() {
    navigate('../');
  }
  let content;
  if (isPending) {
    content = <div className='center'>
      <LoadingIndicator />
    </div>
  }

  if (event) {
    content = (
      <EventForm inputData={event} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    )
  }
  return <Modal onClose={handleClose}>{content}</Modal>
    ;
}
