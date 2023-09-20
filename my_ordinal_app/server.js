const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;


app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));



// Middleware to parse POST request bodies
app.use(bodyParser.json());

// Store events in an array
const events = [];


function hexToUtf8(hex) {
    if (hex.startsWith("0x")) {
        hex = hex.slice(2);
    }
    
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return decodeURIComponent(escape(str));
}

// Handle POST requests to /api/events
app.post('/api/events', (req, res) => {
    const data = req.body;
    
    // 1) Pushing entire block to display

    // events.push(data);


    // 2) Refining to only show inscription_revealed

    // data.apply.forEach(item => {
    //     item.transactions.forEach(transaction => {
    //         if (transaction.metadata && transaction.metadata.ordinal_operations) {
    //             transaction.metadata.ordinal_operations.forEach(operation => {
    //                 if (operation.inscription_revealed) {
    //                     events.push(operation.inscription_revealed);
    //                 }
    //             })
                
    //         }
    //     });
    // });
    


    // 3) Refining to only show brc-20 events

    // data.apply.forEach(item => {
    //     item.transactions.forEach(transaction => {
    //         if (transaction.metadata && transaction.metadata.ordinal_operations) {
    //             transaction.metadata.ordinal_operations.forEach(operation => {
    //                 if (operation.inscription_revealed) {
    //                     let op_data = operation.inscription_revealed;
    //                     if (op_data.content_type === 'text/plain;charset=utf-8') {

    //                         // Looking at inscription_revealed fields:
    //                         // events.push(operation.inscription_revealed);
    //                         // console.log(operation.inscription_revealed);

    //                         const decodedContent = hexToUtf8(op_data.content_bytes);
    //                         try {
    //                             let content = JSON.parse(decodedContent);
    //                             if (content['p'] === 'brc-20') {
    //                                 console.log(decodedContent);  // Outputs: 9214
    //                                 events.push(decodedContent);
    //                             }
    //                         } catch (e) {
    //                             // console.log(e);
    //                         }
    //                     }
    //                 }
    //             })
                
    //         }
    //     });
    // });


    res.status(200).send({ message: 'Event added!' });
});

// Display events in browser
app.get('/events', (req, res) => {
    res.send(`
        <h1>Events</h1>
        <pre>${JSON.stringify(events, null, 2)}</pre>
    `);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
