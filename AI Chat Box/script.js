document.addEventListener('DOMContentLoaded',function(){
    const button = document.querySelector('.chatContainer__btn');
    button.addEventListener('mousedown',()=>{
        button.classList.add('chatContainer__btn--clicked');
    })
    button.addEventListener('mouseup',()=>{
        requestAnimationFrame(()=>{
            button.classList.remove('chatContainer__btn--clicked');
        })
        // requestAnimationFrame is a method that schedules a function to be executed before the next repaint of the screen
    })
    button.addEventListener('mouseleave',()=>{
        button.classList.remove('chatContainer__btn--clicked');
    })
    const apiToken = "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";
    // Choose the models that you want to test:
    const models = {
        DIALOGPT : "microsoft/DialoGPT-medium",
        BLENDERBOT: "facebook/blenderbot-400M-distill",
        GPTNEO: "EleutherAI/gpt-neo-1.3B"
    }
    let selectedModel = models.BLENDERBOT; // Change this to test different models
    document.querySelector('.chatContainer__btn').addEventListener('click',sendMessage);
    async function sendMessage(){
        const userInput = document.querySelector('.chatContainer__text').value;
        if(!userInput.trim()) return;
        // Display User Message:
        appendMessage("You", userInput);
        // Clear input field:
        document.querySelector('.chatContainer__text').value = '';
        // Send request to huggingFace API:
        const response = await fetch(`https://api-inference.huggingface.co/models/${selectedModel}`,{
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiToken}`,
                "Content-Type": `application/JSON`
            },
            body: JSON.stringify({inputs: userInput})
        })
        const data = await response.json();
        console.log(data); // Debugging: Checking the API Response
        let botReply;
        if(Array.isArray(data) && data.length > 0 && data[0].generated_text)
            botReply = data[0].generated_text;
        else if(data.generated_text)
            botReply = data.generated_text;
        else
            botReply = "I'm sorry, I couldn't understand that. Sonimaseng😔😔";
        // Display Bot Reply:
        appendMessage("Bot",botReply);
    }
    function appendMessage(sender,message){
        const chatBox = document.querySelector('.chatContainer__box');
        const messageElement = document.createElement('div');
        messageElement.classList.add('chatContainer__box--message');
        // Add Specific class for Sender (User or Bot):
        if(sender === 'You')
            messageElement.classList.add('user');
        else if(sender === 'Bot')
            messageElement.classList.add('bot');
        messageElement.innerHTML = `<strong style="font-size: 2.5rem;">${sender}: </strong> ${message}`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;  // Auto-scroll to the latest message.
    }
})