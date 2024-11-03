require([
	"esri/Map",
	"esri/views/MapView",
	"esri/layers/GraphicsLayer",
	"esri/Graphic", 
	"esri/geometry/Point"
], function(Map, MapView, GraphicsLayer, Graphic, Point) {
	const map = new Map({
		basemap: "topo-vector"
	});

	const graphicsLayer = new GraphicsLayer();
	map.add(graphicsLayer);

	const view = new MapView({
		container: "viewDiv",
		map: map,
		center: [138.2529, 36.2048],
		zoom: 5
	});

	// Function to add a pin
	function addPin(longitude, latitude) {
		const point = new Point({
			longitude: longitude,
			latitude: latitude
		});

		const simpleMarkerSymbol = {
			type: "simple-marker",
			color: [226, 119, 40], // Orange
			outline: {
				color: [255, 255, 255], // White
				width: 1
			}
		};

		const pointGraphic = new Graphic({
			geometry: point,
			symbol: simpleMarkerSymbol
		});

		graphicsLayer.add(pointGraphic);
	}
});

function processLLMResponse(response) {
    // Destructure the response object
    const { locations, message } = response;
    
    // Verify the response format
    if (!Array.isArray(locations) || typeof message !== 'string') {
        throw new Error('Invalid response format');
    }
    
    // Add pins for each location
    locations.forEach(location => {
        if (location.longitude && location.latitude) {
            addPin(location.longitude, location.latitude);
        }
    });
    
    // Create and append the AI response bubble
    const chatContent = document.getElementById("chatContent");
    const newBubble = document.createElement("div");
    newBubble.classList.add("chat-bubble", "ai-bubble");
    newBubble.textContent = message;
    chatContent.appendChild(newBubble);
    chatContent.scrollTop = chatContent.scrollHeight;
}


function handleClick(button) {
	const buttons = document.querySelectorAll('.button');
	buttons.forEach(btn => btn.classList.remove('active'));
	button.classList.add('active');
}

document.getElementById("newChatButton").addEventListener("click", function() {
	// Clear chat panel messages
	const chatContent = document.getElementById("chatContent");
	chatContent.innerHTML = ""; // Clears the chat panel

	// Create a new input field in the chat entries container
	const chatEntriesContainer = document.getElementById("chatEntriesContainer");
	const newChatBlock = document.createElement("input");
	newChatBlock.type = "text";
	newChatBlock.placeholder = "Please enter conversation title";
	newChatBlock.classList.add("new-chat-entry");

	// Append the new input field to the chat entries container
	chatEntriesContainer.appendChild(newChatBlock);

	// Focus on the new input field
	newChatBlock.focus();

	// Event listener for pressing 'Enter' on the new input field
	newChatBlock.addEventListener("keypress", function(event) {
		if (event.key === "Enter") {
			event.preventDefault();
			if (newChatBlock.value.trim() === "") {
				// Show error box if input is blank
				const userChoice = confirm("The conversation title cannot be blank. Click 'OK' to retry or 'Cancel' to delete the conversation.");
				if (userChoice) {
					newChatBlock.focus(); // Retry
				} else {
					chatEntriesContainer.removeChild(newChatBlock); // Cancel and delete
				}
			} else {
				// Save the input as static text
				const savedTitle = document.createElement("div");
				savedTitle.textContent = newChatBlock.value;
				savedTitle.classList.add("new-chat-entry");
				savedTitle.style.cursor = "pointer"; // Add pointer for interactivity

				// Add click event to highlight the new entry
				savedTitle.addEventListener("click", function() {
					document.querySelectorAll('.new-chat-entry').forEach(entry => entry.classList.remove('active'));
					savedTitle.classList.add('active');
				});

				// Replace input field with static text
				chatEntriesContainer.replaceChild(savedTitle, newChatBlock);
			}
		}
	});
});

document.addEventListener('DOMContentLoaded', () => {
	const divider = document.getElementById('dividerBetweenSections');
	const contentGrid = document.getElementById('contentGrid');

	let isDragging = false;

	divider.addEventListener('mousedown', (e) => {
		isDragging = true;
		document.body.style.cursor = 'col-resize';
	});

	window.addEventListener('mousemove', (e) => {
		if (isDragging) {
			const newWidth = e.clientX;
			// Adjust the grid template columns to resize the panels
			contentGrid.style.gridTemplateColumns = `${newWidth}px auto 1fr`;
		}
	});

	window.addEventListener('mouseup', () => {
		if (isDragging) {
			isDragging = false;
			document.body.style.cursor = 'default';
		}
	});
});

// Function to send a message
async function sendUserMessage() {
    const chatInput = document.getElementById("chatInput");
    const userMessage = chatInput.value.trim();

    if (!userMessage) return;

    // Display user message
    const chatContent = document.getElementById("chatContent");
    const userBubble = document.createElement("div");
    userBubble.classList.add("chat-bubble", "user-bubble");
    userBubble.textContent = userMessage;
    chatContent.appendChild(userBubble);
    
    // Clear input
    chatInput.value = "";
    
    try {
        // Send message to backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userMessage })
        });
        
        const data = await response.json();
        
        // Process the response
        processLLMResponse(data);
        
    } catch (error) {
        console.error('Error:', error);
        // Show error message in chat
        const errorBubble = document.createElement("div");
        errorBubble.classList.add("chat-bubble", "responder-bubble");
        errorBubble.textContent = "Sorry, there was an error processing your request.";
        chatContent.appendChild(errorBubble);
    }
}

// Replace the old event listeners with the new function
document.getElementById("sendButton").addEventListener("click", sendUserMessage);
document.getElementById("chatInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendUserMessage();
    }
});

// Toggle the display of the dropdown menu when the profile icon is clicked
document.querySelector('.profile-icon').addEventListener('click', function() {
	const dropdown = document.getElementById('profileDropdown');
	dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

// Close the dropdown if clicked outside
window.addEventListener('click', function(event) {
	if (!event.target.matches('.profile-icon')) {
		const dropdown = document.getElementById('profileDropdown');
		if (dropdown.style.display === 'block') {
			dropdown.style.display = 'none';
		}
	}
});

document.addEventListener('DOMContentLoaded', () => {
	const visitLengthSelect = document.getElementById('visitLengthSelect');
	for (let i = 1; i <= 30; i++) {
		const option = document.createElement('option');
		option.value = i;
		option.textContent = i;
		visitLengthSelect.appendChild(option);
	}
});

document.addEventListener('DOMContentLoaded', () => {
	const numberGrid = document.getElementById('numberGrid');
	const submitButton = document.getElementById('submitButton');
	const warningMessage = document.getElementById('warningMessage');
	let selectedNumber = null;

	// Create 30 number boxes
	for (let i = 1; i <= 30; i++) {
		const numberBox = document.createElement('div');
		numberBox.classList.add('number-box');
		numberBox.textContent = i;
		numberBox.addEventListener('click', () => {
			// Remove the 'selected' class from any previously selected box
			document.querySelectorAll('.number-box').forEach(box => box.classList.remove('selected'));
			// Mark this box as selected
			numberBox.classList.add('selected');
			selectedNumber = i;
		});
		numberGrid.appendChild(numberBox);
	}

	submitButton.addEventListener('click', () => {
		if (!selectedNumber) {
			warningMessage.style.display = 'block';
		} else {
			warningMessage.style.display = 'none';
			alert(`Preferences submitted successfully! Selected number: ${selectedNumber}`);
			// Add any further actions here
		}
	});
});

const resizeHandle = document.getElementById('resizeHandle');
const chatPane = document.getElementById('chat');
let isResizing = false;

resizeHandle.addEventListener('mousedown', (e) => {
	isResizing = true;
	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('mouseup', () => {
		isResizing = false;
		document.removeEventListener('mousemove', onMouseMove);
	});
});

function onMouseMove(e) {
	if (isResizing) {
		const newHeight = window.innerHeight - e.clientY;
		chatPane.style.height = `${newHeight}px`;
	}
}