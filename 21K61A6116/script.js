const quotes = [
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "You have within you right now, everything you need to deal with whatever the world can throw at you.", author: "Brian Tracy" },
    // Add more quotes as needed
];

function getNewQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    document.getElementById('quote').innerText = randomQuote.text;
    document.getElementById('author').innerText = `- ${randomQuote.author}`;
}

async function copyToClipboardAndSave() {
    const quoteText = document.getElementById('quote').innerText;
    const authorText = document.getElementById('author').innerText;
    const textToCopy = `${quoteText} - ${authorText}`;
    
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('Copy');
    document.body.removeChild(textArea);

    // Save to database after copying
    await saveToDatabase();

    // Display alert after copying
    alert('Quote and author copied to clipboard and saved to database!');
}

async function saveToDatabase() {
    try {
        const quoteText = document.getElementById('quote').innerText;
        const authorText = document.getElementById('author').innerText;

        const response = await fetch('http://localhost:3000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: quoteText, author: authorText }),
        });

        if (response.ok) {
            const responseData = await response.json();
            const savedQuoteId = responseData.id;
            console.log('Quote saved to database with ID:', savedQuoteId);
        } else {
            console.error('Error saving quote to database:', response.statusText);
            const errorMessage = await response.text();
            console.error('Server response:', errorMessage);
        }
    } catch (error) {
        console.error('Error saving quote to database:', error);
    }
}

window.onload = getNewQuote;
