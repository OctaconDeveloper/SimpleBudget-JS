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
		incomeDiv:'.income__list',
		expenseDiv: '.expenses__list',
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

		//Add Items to UI
		addListItem: function(object, type){
			let html, newHtml, element;
			//Create HTML string with placeholder text for individual ttpe
			if(type === 'inc'){
				element = DOMValue.incomeDiv;
				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%amount%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}else{
				element = DOMValue.expenseDiv;
				html ='<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%amount%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			//Replce placeholder with actual object
			newHtml = html.replace('%id%', object.id);
			newHtml = newHtml.replace('%description%', object.description);
			newHtml = newHtml.replace('%amount%', object.amount);

			
			// Insert the HTML into tht DOM
			document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

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
		newItem = budgetCtrl.addItem(input.type, input.description, input.amount);
		
		//3. Add item to the UI
		UICtrl.addListItem(newItem, input.type);
		
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