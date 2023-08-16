const inputData = { input_string: 'Hello, server!' };  // מבנה ה-JSON עם המחרוזת
const url = 'https://www.pythonanywhere.com/user/AkivaKraus/webapps/#id_akivakraus_pythonanywhere_com/process_string';  // נתיב ה-API

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(inputData)  // ממיר את מבנה ה-JSON למחרוזת JSON
})
.then(response => response.json())
.then(data => {
    const outputString = data.output_string;  // המחרוזת שחזרה מהשרת
    console.log('Output from server:', outputString);
})
.catch(error => {
    console.error('Error:', error);
});
