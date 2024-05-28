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
    queryKey: ['event-details', id],
    queryFn: () => getSingleEvent({ id })
  })
  const { mutate } = useMutation({
    mutationFn: updateEvent,
    onMutate: async (data) => {
      const newEvent = data.event;
      await queryClient.cancelQueries({ queryKey: ['event-details', data.id] });
      const previousEvent = queryClient.getQueryData(['event-details', data.id]);
      queryClient.setQueryData(['event-details', data.id], newEvent);
      return { previousEvent, data };
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(['event-details', data.id], context.previousEvent);
    },
    onSettled: (data) => {
      // Update the cache with the new data after a successful mutation
      queryClient.setQueryData(['event-details', data.id], data);
    },
  });

  function handleSubmit(formData) {
    mutate({ id, event: formData })
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
