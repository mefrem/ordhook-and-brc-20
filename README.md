# Ordhook-and-brc-20

Using Hiro's Bitcoin Ordinals inscription indexer named ordhook to iterate on brc-20 development.

## Setting up Ordhook

1. Download [ordhook](https://github.com/hirosystems/ordhook) and compile from source
```bash
git clone https://github.com/hirosystems/ordhook.git
cd ordhook
cargo ordhook-install
```

2. [Optional] Visit the Hiro archive and download the bitcoin index `rocksdb` that ordhook builds. (Note: rocksdb is a pared down version of the bitcoin chain state that enables ordhook to compute an inscription's ordinal number, which is the ordinal number of each satoshi minted on Bitcoin)
- Go to Hiro's archive for ordhook's indexes and files: https://archive.hiro.so/mainnet/ordhook/
- Ctrl-f find "mainnet-ordhook-latest.tar.gz" (59.2 GB as of Sep 20, 2023)
- Download and unzip contents, and drag to ordhook folder within project (`./ordhook/` is the default place for it)

## Using Ordhook

1. Try out ordhook commands `scan` and `service` which allow for historical and ongoing observation, respectively. In terminal:

```bash
ordhook scan blocks 784726 784727 --mainnet
```

This commands returns these results (which happen to be the first two inscriptions ever made):
> Inscription 6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0 revealed at block #767430 (ordinal_number 1252201400444387, inscription_number 0)
> Inscription 26482871f33f1051f450f2da9af275794c0b5f1c61ebf35e4467fb42c2813403i0 revealed at block #767753 (ordinal_number 727624168684699, inscription_number 1) 


2. You can also deliver ordhook `scan` and `service` payloads to an API endpoint. This repo's `my_ordinal_app` project has a Node.js script that is setup to receive ordhook payloads at `http://localhost:3000/api/events`


Here we will scan historical blocks and post inscription data to the URL specified (here, a local web server):
```bash
ordhook scan blocks 784726 784727 --post-to=http://localhost:3000/api/events --config-path=./Ordhook.toml
```

Additionally, ordhook supports ongoing observation of the bitcoin chain for inscription data and can deliver post requests to a specified url.

```bash
ordhook service start --post-to=http://localhost:3000/api/events --config-path=./Ordhook.toml
```

## Creating custom views of Ordinals data with Ordhook

You can extract custom, finely tailored views of ordinals inscription data by working with  ordhook payloads. If you look at the [./my_ordinal_app/server.js] script, you can see three, increasingly narrowly tailored, views of inscription data that ordhook delivers. 

Here we are simply displaying the results in the browser, but you could just as easily populate a database, or trigger another service.

```JavaScript
// Handle POST requests to /api/events
app.post('/api/events', (req, res) => {
    const data = req.body;
    
    // 1) Pushing entire block to display

    // events.push(data);


    // 2) Refining to only show inscription_revealed content for each inscription in a block

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
    


    // 3) Refining to only show brc-20 events, by parsing inscription content_type field and decoding raw hexadecimal data

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
```