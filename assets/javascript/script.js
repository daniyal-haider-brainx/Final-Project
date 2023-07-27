// Wait for the HTML content to be loaded before executing the following code
document.addEventListener('DOMContentLoaded', function () {
  var activePanel = null;
  // Collapse all panels except the first one on load
  $('.panel-collapse').not(':first').hide();

  // Handle click on accordion title
  $('.panel-title a').click(function () {
    var currentPanel = $(this).closest('.panel');

    // Check if a panel is already active
    if (activePanel && activePanel[0] !== currentPanel[0]) {
      // Remove 'active' class from the previous panel
      activePanel.removeClass('active');
      // Remove the red color class from the previous active panel's title
      activePanel.find('.panel-title a').removeClass('collapsed');
      // Collapse the content of the previous panel
      activePanel.find('.panel-collapse').slideUp();
    }

    // Toggle 'active' class on the clicked panel
    currentPanel.toggleClass('active');

    // Toggle the panel content
    currentPanel.find('.panel-collapse').slideToggle();

    // Toggle the red color class for the current accordion title
    currentPanel.find('.panel-title a').toggleClass('collapsed');

    // Reset the color of the previously active panel's title to black
    if (activePanel && activePanel[0] !== currentPanel[0]) {
      activePanel.find('.panel-title a').removeClass('collapsed');
      activePanel.find('.panel-title a').css('color', 'black');
    }

    // Update the activePanel variable with the current clicked panel
    activePanel = currentPanel.hasClass('active') ? currentPanel : null;

    // Set the color of the currently active panel's title
    if (activePanel) {
      activePanel.find('.panel-title a').css('color', 'var(--alert-color)');
    }
  });
  const cartIcon = document.querySelector(".cartfooter");
  cartIcon.addEventListener("click", cartDrawer);

  function cartDrawer() {
    const cart = document.querySelector(".cart_column")
    cart.classList.toggle("open-drawer");
  }


  // Get all the meal cards
  const mealCards = document.querySelectorAll('.cardmeals');

  // Function to handle the click event when a meal card is clicked
  function handleClick(event) {
    // Get the meal value from the clicked card
    const mealValue = event.target.closest('.cardmeals').querySelector('.card-text').textContent.trim();

    // Store the meal value in local storage
    localStorage.setItem('selectedMeal', mealValue);
  }

  // Attach click event listener to each meal card
  mealCards.forEach(card => {
    card.addEventListener('click', handleClick);
  });

  function toggleSelection() {
    // Check if the clicked date is already selected
    const isSelected = this.classList.contains('selected');

    // Remove 'selected' class and reset border style for all dates
    const allDates = document.querySelectorAll('.delivery-dates li');
    allDates.forEach(date => {
      date.classList.remove('selected');
      date.style.borderLeft = '1px solid #ccc';

    });

    // If the clicked date was not selected, apply 'selected' style
    if (!isSelected) {

      this.classList.add('selected');
      this.style.borderLeft = '5px solid red';
    }

    // Update the delivery date display
    const selectedDate = isSelected ? `Delivery Date: ${getNextMonday()}` : this.textContent;
    const deliveryText = document.querySelector('.delivery-text');
    deliveryText.textContent = `Delivery Date: ${selectedDate}`;

    // Store the selected delivery date in local storage
    localStorage.setItem('selectedDate', selectedDate);

    // Update delivery date display in other parts of the page
    const delivery = document.querySelector('.deliverytext');
    const cartdate = document.querySelector('.deliverytextcart');
    delivery.textContent = ` ${selectedDate}`;
    cartdate.textContent = `My delivery for: ${selectedDate}`;
  }


  // Function to handle the 'hover' effect on delivery dates
  function handleHover() {
    if (!this.classList.contains('selected')) {
      this.classList.add('hovered');
    }
  }

  // Function to handle the 'mouseout' event on delivery dates
  function handleMouseOut() {
    if (!this.classList.contains('selected')) {
      this.classList.remove('hovered');
    }
  }

  // Function to get the next Monday's date
  function getNextMonday() {
    const today = new Date();
    const day = today.getDay();
    let daysUntilNextMonday;

    if (day === 0) {
      daysUntilNextMonday = 1;
    } else {
      daysUntilNextMonday = (8 - day) % 7;
    }

    today.setDate(today.getDate() + daysUntilNextMonday);
    return today;
  }
  function generateDeliveryDates() {
    const deliveryDatesTemplate = document.getElementById('deliveryDatesTemplate').content;

    const deliveryDates = deliveryDatesTemplate.cloneNode(true);
    const ul = deliveryDates.querySelector('ul');
    const nextMonday = getNextMonday();
    let isFirstDeliveryDateSet = false;

    for (let i = 0; i < 10; i++) {
      const deliveryDate = new Date(nextMonday);
      deliveryDate.setDate(deliveryDate.getDate() + i);

      const formattedDate = deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });

      const day = deliveryDate.toLocaleDateString('en-US', { weekday: 'long' });
      const month = deliveryDate.toLocaleDateString('en-US', { month: 'long' });
      const date = deliveryDate.toLocaleDateString('en-US', { day: 'numeric' });

      const li = document.createElement('li');
      li.textContent = `${day} ${month}, ${date}`;

      if (i === 0 && !isFirstDeliveryDateSet) {
        const span = document.createElement('span');
        span.innerHTML = '&#9733; Most Popular';
        span.classList.add('popular');
        li.appendChild(span);
        li.classList.add('monday');

        localStorage.setItem('selectedDate', formattedDate);
        isFirstDeliveryDateSet = true;

        const deliveryText = document.querySelector('.delivery-text');
        deliveryText.textContent = `Delivery Date: ${formattedDate}`;
        const deliverytext = document.querySelector('.deliverytext');
        deliverytext.textContent = ` ${formattedDate}`;

        const cartdate = document.querySelector('.deliverytextcart');
        cartdate.textContent = `Delivery Date: ${formattedDate}`;
      }

      li.addEventListener('click', toggleSelection);
      li.addEventListener('mouseenter', handleHover);
      li.addEventListener('mouseleave', handleMouseOut);

      ul.appendChild(li);
    }

    document.querySelector('.custom-element').appendChild(deliveryDates);
  }

  // Generate the delivery dates on page load
  generateDeliveryDates();

  // Fetch meal data from a JSON file
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      // Get the container for meal cards and the template for a single meal card
      const cardContainer = document.querySelector('.meal_cards_layout');
      const cardTemplate = document.querySelector('#card-template');

      // Loop through the meal data and create a card for each meal
      data.forEach(cardData => {
        // Clone the template and get references to its elements
        const card = cardTemplate.content.cloneNode(true);
        const cardElement = card.querySelector('.custom-card');
        const imgElement = card.querySelector('.custom-card-img');
        const titleElement = card.querySelector('.custom-card-title');
        const subtitleElement = card.querySelector('.custom-card-subtitle');
        const glutenElement = card.querySelector('.custom-card-gluten');
        const caloriesElement = card.querySelector('.custom-card-calories');
        const carbsElement = card.querySelector('.custom-card-carbs');
        const proteinsElement = card.querySelector('.custom-card-proteins');
        const buttonElement = card.querySelector('.custom-card-button');
        const priceElement = card.querySelector('.custom-card-price');
        const specialPriceElement = card.querySelector('.bottomright');

        // Populate the card with data from the JSON
        imgElement.src = cardData.image;
        titleElement.textContent = cardData.title;
        subtitleElement.textContent = cardData.subtitle;
        glutenElement.textContent = cardData.gluten;
        caloriesElement.textContent = cardData.calories;
        carbsElement.textContent = cardData.carbs;
        proteinsElement.textContent = cardData.proteins;

        // Set special price and style for special cards
        if (cardData.isSpecial) {
          cardElement.classList.add('special-card');
          specialPriceElement.textContent = '11.99$';
          specialPriceElement.classList.remove('d-none');
        }

        // Set the price and add a click event listener to the 'Add' button
        buttonElement.textContent = 'Add';
        priceElement.textContent = `$${parseFloat(cardData.price).toFixed(2)}`;
        priceElement.setAttribute('data-price', parseFloat(cardData.price));
        buttonElement.addEventListener('click', addToCart);

        // Append the card to the card container
        cardContainer.appendChild(card);
      });
    })
    .catch(error => {
      console.log('Error:', error);
    });

  const cart = [];
  let totalPrice = 0;
  function addToCart(event) {
    const selectedMealLimit = parseInt(localStorage.getItem('selectedMeal'));
    const selectedMealCount = cart.reduce((total, item) => total + item.quantity, 0);

    if (selectedMealCount >= selectedMealLimit) {
      // Reached the limit, cannot add more meals
      return;
    }
    const cardElement = event.target.closest('.custom-card');
    const imgElement = cardElement.querySelector('.custom-card-img');
    const titleElement = cardElement.querySelector('.custom-card-title');
    const subtitleElement = cardElement.querySelector('.custom-card-subtitle'); // Get the subtitle element
    const priceElement = cardElement.querySelector('.custom-card-price');
    const item = {
      image: imgElement.src,
      title: titleElement.textContent,
      subtitle: subtitleElement.textContent, // Add the subtitle property
      price: parseFloat(priceElement.getAttribute('data-price')),
      quantity: 1,
      isSpecial: cardElement.classList.contains('special-card')
    };
    const existingItemIndex = cart.findIndex(cartItem => cartItem.title === item.title);
    if (existingItemIndex !== -1) {
      // If the item already exists in the cart, check if the quantity exceeds the selected meal limit
      if (cart[existingItemIndex].quantity >= selectedMealLimit) {
        return; // Reached the limit for this meal, cannot add more
      }
      cart[existingItemIndex].quantity++;
    } else {
      // Check if the quantity exceeds the selected meal limit
      if (item.quantity > selectedMealLimit) {
        return; // Reached the limit for this meal, cannot add more
      }
      cart.push(item);
    }
    // Update the total price
    totalPrice += item.isSpecial ? parseFloat(localStorage.getItem('specialPrice')) : item.price;
    // Update the cart display
    updateCart();
    updateOrderDetails();
    // Trigger the custom event 'mealAddedToCart' and pass the updated cart as an argument
    $(document).trigger('mealAddedToCart', [cart]);
    const remainingMeals = selectedMealLimit - selectedMealCount - 1; // Subtract 1 for the newly added item
    const nextButton = $('#nextButton');
    if (remainingMeals === 0) {
      nextButton.prop('disabled', false); // Enable the "Next" button
    } else if (remainingMeals === 1) {
      nextButton.prop('disabled', true); // Disable the "Next" button
    }
    // Add class 'special-cart-item' to all cart items that are special
    const cartItems = document.querySelectorAll('.cart_item_list');
    cartItems.forEach((cartItem) => {
      const cartItemTitle = cartItem.querySelector('.cart-item-title').textContent;
      const specialItem = cart.find((item) => item.title === cartItemTitle && item.isSpecial);
      if (specialItem) {
        cartItem.classList.add('special-cart-item');
      } else {
        cartItem.classList.remove('special-cart-item');
      }
    });
  }
  function updateCart() {
    const cartListElement = document.getElementById('cartList');
    const totalPriceElement = document.getElementById('totalPrice');
    const subtotalofCart = document.getElementById('subtotalofCart');
    const subtotalElement = document.getElementById('subtotal');
    const totalQuantityElement = document.getElementById('totalQuantity');
    const totalQuantityCart = document.getElementById('cartItemCount');
    const cart_items = document.getElementById('totalQuantityCart');
    const detailsCard = document.querySelector('.details');
    cartListElement.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;
    let totalSpecialPrice = 0;
    let subtotalRegular = 0; // Initialize subtotal for regular items
    let subtotalSpecial = 0; // Initialize subtotal for special items
    cart.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        const cartItemElement = document.createElement('li');
        cartItemElement.classList.add('cart_item_list');
        // Create a div for subtitle and add it to the cartItemElement
        const subtitleContainer = document.createElement('div');
        subtitleContainer.classList.add('custom-card-subtitle');
        subtitleContainer.textContent = item.subtitle;
        const quantityContainer = document.createElement('div');
        quantityContainer.classList.add('cart-item-quantity');
        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.addEventListener('click', () => decreaseQuantity(item.title));
        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.addEventListener('click', () => increaseQuantity(item.title));
        quantityContainer.appendChild(decreaseButton);
        quantityContainer.appendChild(increaseButton);
        const itemInfoContainer = document.createElement('div');
        itemInfoContainer.classList.add('cart-item-info');
        const imgElement = document.createElement('img');
        imgElement.classList.add('cart-item-img');
        imgElement.src = item.image;
        const titleElement = document.createElement('span');
        titleElement.classList.add('cart-item-title');
        titleElement.textContent = item.title;
        itemInfoContainer.appendChild(imgElement);
        itemInfoContainer.appendChild(titleElement);
        cartItemElement.appendChild(itemInfoContainer);
        cartItemElement.appendChild(quantityContainer);
        cartListElement.appendChild(cartItemElement);
      }
      totalQuantity += item.quantity;
      if (item.isSpecial) {
        totalSpecialPrice += item.price * item.quantity;
      } else {
        subtotalRegular += item.price * item.quantity;
      }
    });
    // Calculate the subtotal for both regular and special items
    const subtotal = subtotalRegular + totalSpecialPrice;
    // Update the total price of special items (without multiplying by quantity)
    const specialItemsTotalPriceElement = $('#specialItemsTotalPrice');
    specialItemsTotalPriceElement.text(totalSpecialPrice.toFixed(2));
    // Update the total price (subtotal + totalSpecialPrice)
    const overallTotalPrice = subtotal + totalSpecialPrice;
    const checkoutoverall = subtotal + totalSpecialPrice;
    localStorage.setItem('subtotal', overallTotalPrice);
    // Update the total price displayed on the page (excluding special price)
    totalPriceElement.textContent = subtotal.toFixed(2);
    subtotalofCart.textContent = subtotal.toFixed(2);
    // subtotalElement.textContent = subtotal.toFixed(2);
    totalPriceElement.textContent = overallTotalPrice.toFixed(2);
    subtotalofCart.textContent = overallTotalPrice.toFixed(2);
    if (totalQuantity > 0) {
      detailsCard.style.display = 'block';
    } else {
      detailsCard.style.display = 'none';
    }
    totalQuantityCart.textContent = totalQuantity;
    cart_items.textContent = totalQuantity;
    localStorage.setItem('totalPrice', overallTotalPrice.toFixed(2));
    toggleDetailsCard();
  }
  function updateOrderDetails() {
    const taxAmountElement = $('#taxAmount');
    const shippingAmountElement = $('#shippingAmount');
    const totalAmountElement = $('#totalAmount');
    const selectedMealsTotalPrice = parseFloat($('#selectedMealsTotalPrice').text());
    const taxAmount = 10.00;
    const shippingAmount = 10.00;
    const subtotal = selectedMealsTotalPrice;
    const totalPrice = parseFloat(localStorage.getItem('totalPrice'));
    const totalAmount = totalPrice + taxAmount + shippingAmount;
    // Update the order details
    taxAmountElement.text(taxAmount.toFixed(2));
    shippingAmountElement.text(shippingAmount.toFixed(2));
    totalAmountElement.text(totalAmount.toFixed(2));
    // Update the subtotal in the checkout summary
    const subtotalElement = $('#subtotal');
    subtotalElement.text(subtotal.toFixed(2));
  }
  function toggleDetailsCard() {
    const detailsCard = $('.details');
    const totalQuantity = parseInt($('#totalQuantityCart').text());
    if (totalQuantity > 0) {
      detailsCard.show();
    } else {
      detailsCard.hide();
    }
  }
  function decreaseQuantity(title) {
    const item = cart.find((cartItem) => cartItem.title === title);
    if (item) {
      if (item.quantity > 1) {
        item.quantity--;
        totalPrice -= item.isSpecial ? parseFloat(localStorage.getItem('specialPrice')) : item.price;
      } else {
        const index = cart.indexOf(item);
        cart.splice(index, 1);
        totalPrice -= item.isSpecial ? parseFloat(localStorage.getItem('specialPrice')) : item.price;
      }
      updateCart();
      $(document).trigger('mealAddedToCart', [cart]);
      updateSpecialCartItems(); // Call the function to update special cart items
    }
  }
  function increaseQuantity(title) {
    const item = cart.find((cartItem) => cartItem.title === title);
    if (item) {
      const selectedMealLimit = parseInt(localStorage.getItem('selectedMeal'));
      const selectedMealCount = cart.reduce((total, item) => total + item.quantity, 0);
      if (selectedMealCount + 1 > selectedMealLimit) {
        return;
      }
      item.quantity++;
      totalPrice += item.isSpecial ? parseFloat(localStorage.getItem('specialPrice')) : item.price;
      updateCart();
      $(document).trigger('mealAddedToCart', [cart]);
      updateSpecialCartItems(); // Call the function to update special cart items
    }
  }
  function updateSpecialCartItems() {
    // Loop through all cart items and check if they are special
    const cartItems = document.querySelectorAll('.cart_item_list');
    cartItems.forEach((cartItem) => {
      const cartItemTitle = cartItem.querySelector('.cart-item-title').textContent;
      const specialItem = cart.find((item) => item.title === cartItemTitle && item.isSpecial);
      if (specialItem) {
        cartItem.classList.add('special-cart-item'); // Add the 'special-cart-item' class
      } else {
        cartItem.classList.remove('special-cart-item'); // Remove the 'special-cart-item' class
      }
    });
  }
  // Add event listener to the "Clear All" button
  const clearAllButton = $('#clearAllButton');
  clearAllButton.click(function () {
    // Clear the cart array
    cart.length = 0;
    // Reset the total price
    totalPrice = 0;
    // Update the cart display
    updateCart();
    // Trigger the custom event 'mealAddedToCart' and pass the updated empty cart as an argument
    $(document).trigger('mealAddedToCart', [cart]);
    updateSelectedMealsTotalPrice();
  });
  localStorage.setItem('specialPrice', 11.99);
  // Listen for the custom event
  $(document).on('mealAddedToCart', function (event, cart) {
    // Update the selected meals section
    updateSelectedMeals(cart);
    updateSelectedMealsTotalPrice();

  });
  function updateSelectedMealsTotalPrice() {
    const selectedMealsTotalPriceElement = $('#selectedMealsTotalPrice');
    // Calculate the total price for selected meals
    let selectedMealsTotalPrice = 0;
    cart.forEach(item => {
      selectedMealsTotalPrice += item.isSpecial ? parseFloat(localStorage.getItem('specialPrice')) * item.quantity : item.price * item.quantity;
    });
    // Get the current value of #specialItemsTotalPrice
    const specialItemsTotalPrice = parseFloat($('#specialItemsTotalPrice').text());
    // Calculate the overall total price (selectedMealsTotalPrice + specialItemsTotalPrice)
    const overallTotalPrice = selectedMealsTotalPrice + specialItemsTotalPrice;
    // Update the selected meals total price on the page
    selectedMealsTotalPriceElement.text(overallTotalPrice.toFixed(2));
    // Update the order details (including shipping, tax, and total) based on the updated subtotal
    updateOrderDetails();
  }
  function updateSelectedMeals(cart) {
    let totalSpecialQuantity = 0;
    let totalRegularQuantity = 0;
    let totalPrice = 0;
    let totalSpecialPrice = 0;
    const selectedMealsList = $('#selectedMealsList');
    const selectedMealsTotalPriceElement = $('#selectedMealsTotalPrice');
    const selectedMealsTotalPrice = $('#price');
    const specialPrice = parseFloat(localStorage.getItem('specialPrice'));

    // Clear the selected meals list
    selectedMealsList.empty();

    // Render the selected meals
    cart.forEach((item, index) => {
      const selectedMealItem = $('<li></li>');
      selectedMealItem.addClass('selected-meal-row');

      // Check if the meal is special, then add the class and the special price overlay
      if (item.isSpecial) {
        selectedMealItem.addClass('special-cart-item');
        selectedMealItem.find('.bottomright').remove();
        const overlay = $('<div class="overlaycheck">' + specialPrice.toFixed(2) + '$</div>');
        selectedMealItem.find('.selected-meal-img').append(overlay);
        totalSpecialQuantity += item.quantity;
        totalSpecialPrice += specialPrice * item.quantity;
      } else {
        totalRegularQuantity += item.quantity;
        totalPrice += item.price * item.quantity;
      }

      // Add the quantity and meal details
      selectedMealItem.html(`
        <div class="selected-meal-quantity">
          <span>${item.quantity}</span>
        </div>
        <div class="selected-meal">
          <img class="selected-meal-img" src="${item.image}">
          <div class="selected-meal-details">
            <h5 class="selected-meal-title">${item.title}</h5>
            <!-- Display subtitle here -->
            <p class="selected-meal-subtitle">${item.subtitle}</p>
          </div>
        </div>
        <div class="meal-line">
      `);

      selectedMealsList.append(selectedMealItem);
    });

    // Calculate the overall total price (subtotal + totalSpecialPrice)
    const overallTotalPrice = totalPrice + totalSpecialPrice;

    // Update the total price of special items (without multiplying by quantity)
    const specialItemsTotalPriceElement = $('#specialItemsTotalPrice');
    specialItemsTotalPriceElement.text(totalSpecialPrice.toFixed(2));

    // Update the total price displayed on the page (subtotal + totalSpecialPrice)
    selectedMealsTotalPriceElement.text(overallTotalPrice.toFixed(2));
    selectedMealsTotalPrice.text(overallTotalPrice.toFixed(2));

    const subtotal = totalPrice + totalSpecialPrice;
    selectedMealsTotalPriceElement.text(subtotal.toFixed(2));
    selectedMealsTotalPrice.text(subtotal.toFixed(2));

    const selectedMealCount = cart.reduce((total, item) => total + item.quantity, 0);
    const selectedMealLimit = parseInt(localStorage.getItem('selectedMeal'));
    const remainingQuantity = selectedMealLimit - selectedMealCount;
    const selectedDate = localStorage.getItem('selectedDate');
    const messageContainer = $('#messageContainer');
    messageContainer.empty();

    const nextButton = $('#nextButton');
    const mobileDisplayCart = $('.mobile_display_cart');

    if (selectedMealCount >= selectedMealLimit) {
      messageContainer.text('Ready to go!');
      nextButton.prop('disabled', false);
      nextButton.css('opacity', 1);
    } else if (selectedMealCount > 0) {
      messageContainer.text(`${remainingQuantity} more to go`);
      nextButton.prop('disabled', true);
      nextButton.css('opacity', 0.5);
      mobileDisplayCart.show();
    } else {
      messageContainer.text('Add meals to continue!');
      nextButton.prop('disabled', true);
      nextButton.css('opacity', 0.5);
      mobileDisplayCart.hide();
    }

    updateOrderDetails();
  }

  // Call the function initially to display selected meals
  const initialCart = [];
  updateSelectedMeals(initialCart);
  updateOrderDetails();
  document.getElementById('validationForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    // Clear previous error messages
    const errorDivs = document.getElementsByClassName('error');
    for (let i = 0; i < errorDivs.length; i++) {
      errorDivs[i].textContent = '';
    }

    // Get form field values
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const fullName = document.getElementById('delivery-name').value;
    const address1 = document.getElementById('address-1').value;
    const address2 = document.getElementById('address-2').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    // Validation patterns
    const namePattern = /^[A-Za-z]+$/;
    const zipPattern = /^\d+$/;
    const phonePattern = /^\d{11}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation logic
    let isValid = true;

    // First Name
    if (firstName === '') {
      document.getElementById('firstNameError').textContent = 'First Name is required.';
      isValid = false;
    } else if (!namePattern.test(firstName)) {
      document.getElementById('firstNameError').textContent = 'First Name cannot have digits.';
      isValid = false;
    }

    // Last Name
    if (lastName === '') {
      document.getElementById('lastNameError').textContent = 'Last Name is required.';
      isValid = false;
    } else if (!namePattern.test(lastName)) {
      document.getElementById('lastNameError').textContent = 'Last Name cannot have digits.';
      isValid = false;
    }

    // Full Name for Delivery Address
    if (fullName === '') {
      document.getElementById('fullnameError').textContent = 'Full Name for Delivery Address is required.';
      isValid = false;
    } else if (!namePattern.test(fullName)) {
      document.getElementById('fullnameError').textContent = 'Full Name for Delivery Address cannot have digits.';
      isValid = false;
    }

    // Address Line 1
    if (address1 === '') {
      document.getElementById('Address1Error').textContent = 'Address Line 1 is required.';
      isValid = false;
    }

    // City and State
    if (!namePattern.test(city)) {
      document.getElementById('cityError').textContent = 'City must have letters only, no numbers.';
      isValid = false;
    }

    if (!namePattern.test(state)) {
      document.getElementById('stateError').textContent = 'State must have letters only, no numbers.';
      isValid = false;
    }

    // ZIP
    if (zip === '') {
      document.getElementById('zipError').textContent = 'ZIP is required.';
      isValid = false;
    } else if (!zipPattern.test(zip)) {
      document.getElementById('zipError').textContent = 'ZIP must only have numeric input.';
      isValid = false;
    }

    // Phone
    if (phone === '') {
      document.getElementById('phoneError').textContent = 'Phone is required.';
      isValid = false;
    } else if (!phonePattern.test(phone)) {
      document.getElementById('phoneError').textContent = 'Phone should be of 11 digits only.';
      isValid = false;
    }

    // Email
    if (email === '') {
      document.getElementById('EmailError').textContent = 'Email is required.';
      isValid = false;
    } else if (!emailPattern.test(email)) {
      document.getElementById('EmailError').textContent = 'Please enter a valid email address.';
      isValid = false;
    }

    if (isValid) {
      alert('Form successfully submitted!');
      validationForm.reset();
    }
  });
});
