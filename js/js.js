//Bundle COntroller Module
const budgetController = (function() {
	
	//create expenses (debit) constructor
	let Debit = function(id,description,amount){
		this.id = id;
		this.description = description;
		this.amount = amount;
	}

	//create incomes (credit) constructor
	let Credit = function(id,description,amount){
		this.id = id;
		this.description = description;
		this.amount = amount;
	}

	//Initialize  variables for debit and credit
	let data = {
		transaction:{
			exp:[],
			inc: [],
		},
		totals:{
			exp: 0,
			inc: 0
		}
	};

	//Create public methods
	return{
		//adding Item to budget controller
		addItem: function(type,description,amount){
			let newItem, id;

			//Get last ID and create new ID for new item
			if(data.transaction[type].length > 0){
				id = data.transaction[type][data.transaction[type].length - 1].id + 1;
			}else{
				id = 0;
			}


			//Check transaction type
			switch(type){
				case 'exp':
				newItem = new Debit(id, description, amount);
				break;
				case 'inc':
				newItem = new Credit(id, description, amount);
				break;
				default:
			};

			//Add to Array
			data.transaction[type].push(newItem);

			//Return newly created item
			return newItem;
		},

		testing: function() {
			console.log(data);
		},
	}

})();

//UI display Controller
const UIController = (function(){
	//Store DOM Strings coming from UI
	let DOMValue = {
		type:'.add__type',
		amount: '.add__value',
		description: '.add__description',
		button: '.add__btn',
	}
	return {
		//Get input from UI and make it public
		getinput: function(){
			return{
				type: document.querySelector(DOMValue.type).value,
				amount: document.querySelector(DOMValue.amount).value,
				description: document.querySelector(DOMValue.description).value,
			}

		},
		//Return DOM Strings as public values
		getDomValues: function(){
			return DOMValue;
		}
	}
})();

//Global App Controller
const Interface   = (function(budgetCtrl, UICtrl){
	//Group all EventListeners
	let eventListernerGroup = function(){
		//Get DOM Strings from UICtrl
		let DOM = UICtrl.getDomValues();

		//Upon Add button Clicked
		document.querySelector(DOM.button).addEventListener('click', ctrlAddItem);

		//Upon ENTER Button Click
		document.addEventListener('keypress', function(event){
			if(event.keyCode === 13 || event.which === 13){
					ctrlAddItem();
			}
		});
	};


	//Logic to add Item to budget, BudgetController and UIController
	let ctrlAddItem = function(){
		let input, newItem;
		//1. Get the filed input data
		input = UICtrl.getinput();
		// console.log(input);
		
		//2. Add the tem to the budget controller
		Item = budgetCtrl.addItem(input.type, input.description, input.amount);
		
		//3. Add item to the UI

		
		//4. Calculate the budget

		
		//5. Display the budget on the UI

	};

	return {
		//Initilize  our Interface
		init: function(){
			//call eventlisteners
			eventListernerGroup();


		}
	}

	


})(budgetController, UIController);

//Make the initialization Call
Interface.init();