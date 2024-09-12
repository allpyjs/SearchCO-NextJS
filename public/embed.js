document.addEventListener('DOMContentLoaded', function () {
    if (window.embeddedChatbotConfig) {
        const { chatbotId, domain } = window.embeddedChatbotConfig;
        const currentDomain = window.location.hostname;

        initializeChatbot(chatbotId, domain);
        if (currentDomain !== domain) {
        }
    } else {
        console.error('Chatbot configuration is missing!');
    }
});

function initializeChatbot(chatbotId, domain) {
    const chatbotAPI = `http://localhost:3000/website-integration/chatbot-iframe/${chatbotId}`;

    const openButton = document.createElement('button');
    openButton.id = 'openChatButton';
    openButton.setAttribute('aria-label', 'open-chat-button');
    openButton.innerHTML = '<svg height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 443.541 443.541" xml:space="preserve" fill="#FFFFFF" stroke="#FFFFFF"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path style="fill:#FFFFFF;" d="M76.579,433.451V335.26C27.8,300.038,0,249.409,0,195.254C0,93.155,99.486,10.09,221.771,10.09 s221.771,83.065,221.771,185.164s-99.486,185.164-221.771,185.164c-14.488,0-29.077-1.211-43.445-3.604L76.579,433.451z"></path> </g> </g> </g></svg>';
    openButton.style.cssText = 'position: fixed; border: 0px; bottom: 1rem; justify-content: center; right: 1rem; width: 55px; height: 55px; border-radius: 27.5px; background-color: rgb(0, 0, 0); box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px; cursor: pointer; z-index: 2147483645; transition: all 0.2s ease-in-out;';

    const closeButton = document.createElement('button');
    closeButton.id = 'closeChatButton';
    closeButton.setAttribute('aria-label', 'close-chat-button');
    closeButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" id="closeIcon" strokeWidth="2.3" stroke="white"><path d="M19.5 8.25l-7.5 7.5-7.5-7.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>';
    closeButton.style.cssText = 'position: fixed; border: 0px; bottom: 1rem;  align-items: center; right: 1rem; width: 55px; height: 55px; border-radius: 27.5px; background-color: rgb(0, 0, 0); box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px; cursor: pointer; z-index: 2147483645; transition: all 0.2s ease-in-out; display: none;';

    const chatIframe = document.createElement('iframe');
    chatIframe.id = 'chatbase-bubble-window';
    chatIframe.setAttribute('scrolling', 'yes');
    chatIframe.setAttribute('title', 'Chatbot');
    chatIframe.src = chatbotAPI
    chatIframe.style.cssText = 'border: 1px solid #dddddd; position: fixed; bottom: 5rem; right: 1rem; width: 448px; height: 85vh; max-height: 824px; border-radius: 0.75rem; display: none; z-index: 2147483646; overflow: hidden;';

    document.body.appendChild(openButton);
    document.body.appendChild(closeButton);
    document.body.appendChild(chatIframe);

    function openChat() {
        chatIframe.style.display = 'block';
        openButton.style.display = 'none';
        closeButton.style.display = 'block';
    }

    function closeChat() {
        chatIframe.style.display = 'none';
        closeButton.style.display = 'none';
        openButton.style.display = 'block';
    }

    openButton.addEventListener('click', openChat);
    closeButton.addEventListener('click', closeChat);
}
