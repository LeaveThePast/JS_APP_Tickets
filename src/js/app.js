document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "http://localhost:3000/";

  // Форма нового тикета
  const ticketFormElement = document.getElementById("ticketForm");
  const ticketNameElement = document.getElementById("ticketName");
  const ticketDescriptionElement = document.getElementById("ticketDescription");
  const ticketStatusElement = document.getElementById("ticketStatus");
  const addTicketBtnElement = document.getElementById("addTicketBtn");
  const closeTicketFormBtnElement =
    document.getElementById("closeTicketFormBtn");

  // Форма обновления тикета
  const ticketUpdateFormElement = document.getElementById("ticketUpdateForm");
  const ticketUpdateNameElement = document.getElementById("ticketUpdateName");
  const ticketUpdateDescriptionElement = document.getElementById(
    "ticketUpdateDescription"
  );
  const ticketUpdateStatusElement =
    document.getElementById("ticketUpdateStatus");
  const UpdateTicketBtnElement = document.getElementById("UpdateTicketBtn");
  const closeUpdateTicketFormBtnElement = document.getElementById(
    "closeUpdateTicketFormBtn"
  );

  // Список тикетов
  const ticketListElement = document.getElementById("ticketList");
  let tickets;
  const createTicketElement = document.getElementById("createTicketBtn");

  async function displayTickets() {
    try {
      const response = await fetch(apiUrl + "?method=allTickets");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      tickets = await response.json();

      renderTickets(tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  }
  function handleTicketClick(event) {
    const ticketElement = event.target.closest(".ticket");
    if (ticketElement) {
      const ticketId = ticketElement.dataset.id;
      const ticket = tickets.find((t) => t.id === ticketId);

      if (ticket) {
        updateTicket(ticket.id, ticket.name, ticket.description, ticket.status);
      }
    }
  }

  function handleDeleteButtonClick(event) {
    const deleteButton = event.target.closest(".deleteButton");
    if (deleteButton) {
      const ticketElement = deleteButton.closest(".ticket");
      const ticketId = ticketElement.dataset.id;

      deleteTicket(ticketId);
    }
  }

  function renderTickets(tickets) {
    ticketListElement.innerHTML = "";

    tickets.forEach((ticket) => {
      const ticketElement = document.createElement("div");
      ticketElement.classList.add("ticket");
      ticketElement.dataset.id = ticket.id;

      const ticketElementContent = document.createElement("p");
      ticketElementContent.textContent = `${ticket.name} - ${ticket.status}`;
      ticketElement.appendChild(ticketElementContent);

      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = "🗑️";
      deleteButton.classList.add("deleteButton");
      ticketElement.appendChild(deleteButton);

      ticketListElement.appendChild(ticketElement);
    });
  }

  ticketListElement.addEventListener("click", handleTicketClick);
  ticketListElement.addEventListener("click", handleDeleteButtonClick);

  async function createTicket() {
    try {
      const response = await fetch(apiUrl + "?method=createTicket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: ticketNameElement.value,
          description: ticketDescriptionElement.value,
          status: ticketStatusElement.value,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newTicket = await response.json();
      console.log("New Ticket:", newTicket);

      ticketNameElement.value = "";
      ticketDescriptionElement.value = "";
      ticketStatusElement.value = "";
      await displayTickets();
      ticketFormElement.classList.add("formInactive");
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  }

  async function updateTicket(id, name, description, status) {
    ticketUpdateFormElement.classList.remove("formInactive");
    ticketUpdateNameElement.value = name;
    ticketUpdateDescriptionElement.value = description;
    ticketUpdateStatusElement.value = status;
    const updateTicketBtnClickHandler = async () => {
      try {
        name = ticketUpdateNameElement.value;
        description = ticketUpdateDescriptionElement.value;
        status = ticketUpdateStatusElement.value;
        const response = await fetch(apiUrl + "?method=updateTicket", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, name, description, status }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Update Ticket Result:", result);

        await displayTickets();
        ticketUpdateFormElement.classList.add("formInactive");
      } catch (error) {
        console.error("Error updating ticket:", error);
      }
    };

    UpdateTicketBtnElement.removeEventListener(
      "click",
      updateTicketBtnClickHandler
    );
    UpdateTicketBtnElement.addEventListener(
      "click",
      updateTicketBtnClickHandler
    );
  }

  async function deleteTicket(id) {
    try {
      const response = await fetch(apiUrl + "?method=deleteTicket", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Delete Ticket Result:", result);

      await displayTickets();
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  }

  // Обработка действия списка тикетов

  addTicketBtnElement.addEventListener("click", () => {
    ticketFormElement.classList.remove("formInactive");
  });
  createTicketElement.addEventListener("click", createTicket);
  closeUpdateTicketFormBtnElement.addEventListener("click", () => {
    ticketUpdateNameElement.value = "";
    ticketUpdateDescriptionElement.value = "";
    ticketUpdateStatusElement.value = "";
    ticketUpdateFormElement.classList.add("formInactive");
  });
  closeTicketFormBtnElement.addEventListener("click", () => {
    ticketNameElement.value = "";
    ticketDescriptionElement.value = "";
    ticketStatusElement.value = "Open";
    ticketFormElement.classList.add("formInactive");
  });

  displayTickets();
});
