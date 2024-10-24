

const formatPrice = (priceInPaise) => {
	return `Rs. ${(priceInPaise / 100).toLocaleString("en-IN", {
		minimumFractionDigits: 2,
	})}`;
};

const updateCartTotals = (cartData) => {
    let newTotal=0;

    cartData.items.forEach((item)=>{
        newTotal += item.price * item.quantity;
    });

    cartData.items_subtotal_price = newTotal;
    
	const cartSubtotal = document.getElementById("cart-subtotal");
	const cartTotal = document.getElementById("cart-total");
	cartSubtotal.textContent = formatPrice(cartData.items_subtotal_price);
	cartTotal.textContent = formatPrice(cartData.items_subtotal_price);
};

const populateCart = (cartData) => {
	const cartItemsContainer = document.getElementById("cart-items");
	cartItemsContainer.innerHTML = "";

	cartData.items.forEach((item, index) => {
		const row = document.createElement("tr");

		row.innerHTML = `
      <td>
        <div class="product-details">
          <img src="${item.image}" alt="${item.title}" class="product-img">
          <p><a href=".">${item.title}</a></p>
        </div>
      </td>
      <td>${formatPrice(item.price)}</td>
      <td><input type="number" value="${item.quantity}" class="quantity-input" data-index="${index}"></td>
      <td class="item-subtotal">${formatPrice(item.price * item.quantity)}</td>
      <td><img src="./assets/trash-icon.png" alt="Delete" class="delete-icon"></td>
    `;
		cartItemsContainer.appendChild(row);
	});

	updateCartTotals(cartData);

	const quantityInputs = document.querySelectorAll(".quantity-input");
	quantityInputs.forEach((input) => {
		input.addEventListener("change", (event) => {
			const index = event.target.dataset.index;
			const newQuantity = parseInt(event.target.value, 10);

			if (newQuantity >= 1) {
				cartData.items[index].quantity = newQuantity;

				const itemSubtotal = event.target
					.closest("tr")
					.querySelector(".item-subtotal");
				itemSubtotal.textContent = formatPrice(
					cartData.items[index].price * newQuantity
				);

				cartData.items_subtotal_price = cartData.items.reduce(
					(acc, item) => acc + item.price * item.quantity,0 );

				updateCartTotals(cartData);
			}
		});
	});

    deleteFunction(cartData);
    
};

const deleteFunction = (cartData)=>{
    const trashData = document.querySelectorAll(".delete-icon");

    trashData.forEach((icon)=>{
    icon.addEventListener("click",(event)=>{
        const itemIndex = event.target.getAttribute("data-index");
        cartData.items.splice(itemIndex,1);

        updateCartTotals(cartData)
        populateCart(cartData);
    });
    // updateCartTotals({"cartData":{"items_subtotal_price":0,"items_subtotal_price":0}});
    
});

}

const apiData = async () => {
	try {
		const response = await fetch(
			"https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889"
		);
		const cartData = await response.json();
		populateCart(cartData);
	} catch (error) {
		console.error("Error fetching cart data:", error);
	}
};

apiData();
