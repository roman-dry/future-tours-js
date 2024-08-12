import React, { useState } from 'react';
import { baseUrl } from '../../api/http-client';
import { saveAs } from 'file-saver';
import { useForm } from 'react-hook-form';

const Ticket = () => {

    // const [name, setName] = useState(''); 
    // const [transports, setTransports] = useState([]); 
    // const [robots, setRobots] = useState([]); 
    const { register, handleSubmit } = useForm();
    const TICKET_URL = `/api/auth/generateTicket`;

    const downloadPdf = async (ticket) => {
        const name = ticket.name;
        const surname = ticket.surname;
        let century;
        if (ticket.century === '22' || ticket.century === '32') {
            century = ticket.century + 'nd';
        } else if (ticket.century === '23' || ticket.century === '33') {
            century = ticket.century + 'rd';
        } else if (ticket.century === '31') {
            century = ticket.century + 'st';
        } else {
            century = ticket.century + 'th';
        }
 
        let transports = [];
        let robots = [];
        transports = [...transports, ticket.transport1, ticket.transport2, ticket.transport3, ticket.transport4, 
            ticket.transport5, ticket.transport6, ticket.transport7, ticket.transport8, ticket.transport9, ticket.transport10, 
            ticket.transport11, ticket.transport12];
        robots = [...robots, ticket.robot1, ticket.robot2, ticket.robot3, ticket.robot4, ticket.robot5, ticket.robot6, 
            ticket.robot7, ticket.robot8, ticket.robot9, ticket.robot10, ticket.robot11, ticket.robot12];

        // transports.sort();
        // robots.sort();
        console.log(transports);
        console.log(robots);

        try {
            const response = await baseUrl.post(TICKET_URL, { name, surname, century, transports, robots }, {
                responseType: 'blob',
            });
            console.log(response.data);

            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
            saveAs(pdfBlob, 'modified_template.pdf');
        } catch (error) {
            console.error('Failed to download PDF', error);
        }
      };



    return (
        <div>
            {/* <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter your name"
            />
            <input 
                type="text" 
                value={transport} 
                onChange={(e) => setTransport(e.target.value)} 
                placeholder="Enter your transport"
            />
            <button onClick={downloadPdf}>Download PDF</button> */}
            <h4 className='mt-2'>Order the tour</h4>
            <form className='mt-2' onSubmit={handleSubmit(downloadPdf)}>
                <input {...register('name', { require: true })} name='name' placeholder='Enter your name' /><br />
                <input className='mt-1' {...register('surname', { require: true })} name='surname' placeholder='Enter your name surname' /><br />
                <input className='mt-1' {...register('century', { require: true })} name='century' placeholder='Choose the century you prefer' /><br />
                <input className='mt-1' {...register('transport1')} name='transport1' placeholder='Choose the transport1 you prefer' /><br />
                <input className='mt-1' {...register('transport2')} name='transport2' placeholder='Choose the transport2 you prefer' /><br />
                <input className='mt-1' {...register('transport3')} name='transport3' placeholder='Choose the transport3 you prefer' /><br />
                <input className='mt-1' {...register('transport4')} name='transport4' placeholder='Choose the transport4 you prefer' /><br />
                <input className='mt-1' {...register('transport5')} name='transport5' placeholder='Choose the transport5 you prefer' /><br />
                <input className='mt-1' {...register('transport6')} name='transport6' placeholder='Choose the transport6 you prefer' /><br />
                <input className='mt-1' {...register('transport7')} name='transport7' placeholder='Choose the transport7 you prefer' /><br />
                <input className='mt-1' {...register('transport8')} name='transport8' placeholder='Choose the transport8 you prefer' /><br />
                <input className='mt-1' {...register('transport9')} name='transport9' placeholder='Choose the transport9 you prefer' /><br />
                <input className='mt-1' {...register('transport10')} name='transport10' placeholder='Choose the transport10 you prefer' /><br />
                <input className='mt-1' {...register('transport11')} name='transport11' placeholder='Choose the transport11 you prefer' /><br />
                <input className='mt-1' {...register('transport12')} name='transport12' placeholder='Choose the transport12 you prefer' /><br />
                <input className='mt-1' {...register('robot1')} name='robot1' placeholder='Choose the robot1 you prefer' /><br />
                <input className='mt-1' {...register('robot2')} name='robot2' placeholder='Choose the robot2 you prefer' /><br />
                <input className='mt-1' {...register('robot3')} name='robot3' placeholder='Choose the robot3 you prefer' /><br />
                <input className='mt-1' {...register('robot4')} name='robot4' placeholder='Choose the robot4 you prefer' /><br />
                <input className='mt-1' {...register('robot5')} name='robot5' placeholder='Choose the robot5 you prefer' /><br />
                <input className='mt-1' {...register('robot6')} name='robot6' placeholder='Choose the robot6 you prefer' /><br />
                <input className='mt-1' {...register('robot7')} name='robot7' placeholder='Choose the robot7 you prefer' /><br />
                <input className='mt-1' {...register('robot8')} name='robot8' placeholder='Choose the robot8 you prefer' /><br />
                <input className='mt-1' {...register('robot9')} name='robot9' placeholder='Choose the robot9 you prefer' /><br />
                <input className='mt-1' {...register('robot10')} name='robot10' placeholder='Choose the robot10 you prefer' /><br />
                <input className='mt-1' {...register('robot11')} name='robot11' placeholder='Choose the robot11 you prefer' /><br />
                <input className='mt-1' {...register('robot12')} name='robot12' placeholder='Choose the robot12 you prefer' /><br />
                <button className='mt-3' type='submit'>Get Ticket</button>


            </form>

        </div>
        
    );
};

export default Ticket;
