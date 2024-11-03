require([
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer"
], function(Map, MapView, Graphic, GraphicsLayer) {
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

    function addPin(latitude, longitude) {
        // Clear existing graphics
        // graphicsLayer.removeAll();

        // Create a point
        const point = {
            type: "point",
            longitude: longitude,
            latitude: latitude
        };

        // Create a symbol for rendering the point
        const markerSymbol = {
            type: "simple-marker",
            color: [226, 119, 40], // Orange
            outline: {
                color: [255, 255, 255], // White
                width: 2
            }
        };

        // Create a graphic and add it to the graphics layer
        const pointGraphic = new Graphic({
            geometry: point,
            symbol: markerSymbol
        });

        graphicsLayer.add(pointGraphic);

        // Center the map on the new point
        view.goTo({
            center: [longitude, latitude],
            zoom: 12
        });
    }

    // Add event listener for the button
    document.getElementById("addPinButton").addEventListener("click", function() {
        const lat = parseFloat(document.getElementById("latInput").value);
        const long = parseFloat(document.getElementById("longInput").value);

        if (isNaN(lat) || isNaN(long)) {
            alert("Please enter valid coordinates");
            return;
        }

        if (lat < -90 || lat > 90 || long < -180 || long > 180) {
            alert("Please enter valid coordinates:\nLatitude: -90 to 90\nLongitude: -180 to 180");
            return;
        }

        addPin(lat, long);
    });

    // Add sample coordinates array (you can adjust these coordinates as needed)
    const sampleLocations = [
        [35.6762, 139.6503],  // Tokyo
        [34.6937, 135.5023],  // Osaka
        [43.0618, 141.3545],  // Sapporo
        [33.5904, 130.4017],  // Fukuoka
        [26.2124, 127.6809],  // Naha
    ];

    // Add button to the map
    const testButton = document.createElement("button");
    testButton.textContent = "Add Test Pins";
    testButton.style.position = "absolute";
    testButton.style.top = "20px";
    testButton.style.right = "20px";
    testButton.style.zIndex = "1000";
    testButton.style.padding = "8px 16px";
    testButton.style.backgroundColor = "#fff";
    testButton.style.border = "1px solid #ccc";
    testButton.style.borderRadius = "4px";
    testButton.style.cursor = "pointer";

    // Add button to map container
    view.ui.add(testButton, "top-right");

    // Add click event for the test button
    testButton.addEventListener("click", function() {
        console.log("Test button clicked");
        sampleLocations.forEach(location => {
            console.log("Adding pin at:", location[0], location[1]);
            addPin(location[0], location[1]);
        });
        
        // Optional: Zoom out to see all pins
        view.goTo({
            center: [135.5023, 35.6762],
            zoom: 5
        });
    });

    // Add this function to process the itinerary locations
    function processItineraryLocations(locations) {
        // Clear existing pins if needed
        graphicsLayer.removeAll();
        
        // Process each location
        locations.forEach(async (location) => {
            // Assuming location object has latitude and longitude properties
            if (location.latitude && location.longitude) {
                addPin(location.latitude, location.longitude);
            }
        });

        // Zoom out to see all pins
        view.goTo({
            center: [135.5023, 35.6762], // Center of Japan
            zoom: 5
        });
    }

    // Example of how to integrate with LLM response:
    function handleLLMResponse(response) {
        // Check if we have locations to process
        if (response.locations && response.locations.length > 0) {
            processItineraryLocations(response.locations);
        }
        
        // Handle the LLM text response
        const chatContent = document.getElementById("chatContent");
        const newBubble = document.createElement("div");
        newBubble.classList.add("chat-bubble", "responder-bubble");
        newBubble.textContent = response.message;
        chatContent.appendChild(newBubble);
        chatContent.scrollTop = chatContent.scrollHeight;
    }
});

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
    function sendMessage() {
      const chatInput = document.getElementById("chatInput");
      const chatContent = document.getElementById("chatContent");
      const userMessage = chatInput.value.trim();

      if (userMessage) {
        const newBubble = document.createElement("div");
        newBubble.classList.add("chat-bubble", "user-bubble");
        newBubble.textContent = userMessage;
        chatContent.appendChild(newBubble);
        chatInput.value = ""; // Clear the input field
        chatContent.scrollTop = chatContent.scrollHeight; // Scroll to the bottom
      }
    }

    // Event listener for the send button
    document.getElementById("sendButton").addEventListener("click", sendMessage);

    // Event listener for pressing 'Enter' in the text input
    document.getElementById("chatInput").addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent default 'Enter' key behavior
        sendMessage();
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
      
      
      
      