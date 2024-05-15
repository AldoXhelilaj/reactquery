import {QueryClient} from '@tanstack/react-query'

export const  queryClient = new QueryClient()


export async function fetchEvents({ searchTerm }) {

    let url = 'http://localhost:3000/events';
    if (searchTerm) {
        url += `?search=${searchTerm}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
        const error = new Error('An error occurred while fetching the events');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const { events } = await response.json();

    return events;
}

export async function createEvent(event) {
    const response = await fetch('http://localhost:3000/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    });

    if (!response.ok) {
        const error = new Error('An error occurred while fetching the events');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const { event: createdEvent } = await response.json();
    return createdEvent;
}

export async function getImages ({signal}) {

    const response = await fetch('http://localhost:3000/events/images',{signal});

    if (!response.ok) {
        const error = new Error('An error occurred while fetching the images');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const { images } = await response.json();
    console.log(images, 'images');
    return images;
}

export async function getSingleEvent({id, signal}) {

    const response = await fetch(`http://localhost:3000/events/${id}`,{signal});

    if (!response.ok) {
        const error = new Error('An error occurred while fetching the single event');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const { event } = await response.json();
    return event;
}

export async function deleteEvent({id}) {
    const response = await fetch(`http://localhost:3000/events/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        const error = new Error('An error occurred while deleting the event');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }
    const { event } = await response.json();
    return event;
}

export async function updateEvent({event, id}) {
    const response = await fetch(`http://localhost:3000/events/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({event})
    });

    if (!response.ok) {
        const error = new Error('An error occurred while updating the event');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }
    const { event: updatedEvent } = await response.json();
    return updatedEvent;
}