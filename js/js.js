//Bundle COntroller Module
const budgetController = (function() {
	
	//create expenses (debit) constructor
	let Debit = function(id,description,amount){
		this.id = id;
		this.description = description;
		this.amount = amount;
		this.percentage = -1;
	};

	Debit.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.amount / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

	Debit.prototype.getPercentage = function(){
		return this.percentage;
	};

	//create incomes (credit) constructor
	let Credit = function(id,description,amount){
		this.id = id;
		this.description = description;
		this.amount = amount;
	};

	//Initailize variable for total costs
	let calculateTotal = function(type){
		let sum = 0;
		data.transaction[type].forEach(function(current){
			sum += current.amount;
		});
		data.totals[type] = sum;

	};

	//Initialize  variables for debit and credit
	let data = {
		transaction:{
			exp:[],
			inc: [],
		},
		totals:{
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1,
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

		//delete Item
		deleteItem:function(type,id){
			let ids, index;
			ids = data.transaction[type].map(function(current){
				return current.id;
			});

			index = ids.indexOf(id);

			if(index !== -1){
				data.transaction[type].splice(index, 1);
			}

		},

		calculateBudget: function(){
			//calculate the total debit and credit
			calculateTotal('exp');
			calculateTotal('inc');

			//calculate the budget: credit - debit
			data.budget = data.totals.inc - data.totals.exp;

			//calculate the perentage of debit
			if(data.totals.inc > 0){
				data.perentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			}else{
				data.perentage = -1;
			}
			
		},

		//calculate percentage
		calculatePercentages: function(){
			data.transaction.exp.forEach(function(cur) {
               cur.calcPercentage(data.totals.inc);
            });
		},

		 getPercentages: function() {
            var allPerc = data.transaction.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

		getBudget: function(){
			return {
				budget: data.budget,
				totalCredit: data.totals.inc,
				totalDebit: data.totals.exp,
				perentage: data.perentage,
			}
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
		budgetDiv: '.budget__value',
		creditLabel: '.budget__income--value',
		debitLabel: '.budget__expenses--value',
		perentageLabel: '.budget__expenses--percentage',
		container: '.container',
		debitPercentageLabel: '.item__percentage',
		month_year: '.budget__title--month',
	}
	return {
		//Get input from UI and make it public
		getinput: function(){
			return{
				type: document.querySelector(DOMValue.type).value,
				amount: parseFloat(document.querySelector(DOMValue.amount).value),
				description: document.querySelector(DOMValue.description).value,
			}

		},

		//Add Items to UI
		addListItem: function(object, type){
			let html, newHtml, element;
			//Create HTML string with placeholder text for individual ttpe
			if(type === 'inc'){
				element = DOMValue.incomeDiv;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%amount%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}else{
				element = DOMValue.expenseDiv;
				html ='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%amount%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			//Replce placeholder with actual object
			newHtml = html.replace('%id%', object.id);
			newHtml = newHtml.replace('%description%', object.description);
			newHtml = newHtml.replace('%amount%', object.amount);

			
			// Insert the HTML into tht DOM
			document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

		},
		
		//Delete item from Interface
		deleteListItem:function(selectorID){
			let el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);

		},

		//Reset all input fields 
		clearFields: function(){
			let fields, fieldsArr;
			fields = document.querySelectorAll(DOMValue.description+', '+DOMValue.amount);
			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(current, index, array){
				current.value = "";
			});
			fieldsArr[0].focus();
		},

		//display budget value
		displayBudget: function(obj){
			document.querySelector(DOMValue.budgetDiv).textContent =  new Intl.NumberFormat('NGN', { style: 'currency', currency: 'NGN' , maximumSignificantDigits: 3 }).format(obj.budget);
			document.querySelector(DOMValue.creditLabel).textContent = '+ ' + new Intl.NumberFormat('NGN', { style: 'currency', currency: 'NGN' , maximumSignificantDigits: 3 }).format(obj.totalCredit);
			document.querySelector(DOMValue.debitLabel).textContent = '- ' + new Intl.NumberFormat('NGN', { style: 'currency', currency: 'NGN' , maximumSignificantDigits: 3 }).format(obj.totalDebit);
			if(obj.perentage > 0){
				document.querySelector(DOMValue.perentageLabel).textContent = obj.perentage+'%';
			}else{
				document.querySelector(DOMValue.perentageLabel).textContent = '___';
			}
		},

		//display Percentage
		displayPercentages: function(percentages){
			let fields, nodeListForEach;
			fields = document.querySelectorAll(DOMValue.debitPercentageLabel);

			nodeListForEach = function(list, callback){
				for(var i=0; i < list.length; i++){
					callback(list[i],i);
				}
			};

			nodeListForEach(fields, function(current, index){
				if(percentages[index] > 0){
					current.textContent = percentages[index] + '%';
				}else{
					current.textContent = '___';
				}
			});
		},


		//display Month

		displayMonth: function(){
			let now, year, month, months;
			now = new Date();

			year = now.getFullYear();
			months =  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			month = now.getMonth();

			document.querySelector(DOMValue.month_year).textContent = months[month]+ ' '+year;

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

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
	};


	//Logic to add Item to budget, BudgetController and UIController
	let ctrlAddItem = function(){
		let input, newItem;
		//1. Get the filed input data
		input = UICtrl.getinput();

		//test for empty imputs
		if(input.description !=="" && !isNaN(input.amount) && input.amount > 0 ){
			//2. Add the tem to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.amount);
			
			//3. Add item to the UI
			UICtrl.addListItem(newItem, input.type);

			//4. Clear the fIelds
			UICtrl.clearFields();

			//5.  Calculate Budget
			ctrlUpdateBudget();

			//6. Calculate percenatge and display
			ctrlUpdatePercentage();
		}
		

	};

	//Updating Budget Percentage
	let ctrlUpdatePercentage = function(){

		//1. Calculate Percentages
		budgetCtrl.calculatePercentages();

		//2. Read percentages from the budget controller
		var percentages = budgetCtrl.getPercentages();
		// console.log(percentages);
		//3. Update the UI with the new percebtages
		// console.log(percentages);
		UICtrl.displayPercentages(percentages);
	};

	//Updating Budget Info
	let ctrlUpdateBudget = function(){
		let budget;
		//1. Calculate the budget
		budgetCtrl.calculateBudget();

		//2. Return the budget
		budget = budgetCtrl.getBudget();

		//3. Display the budget on the UI
		UICtrl.displayBudget(budget);
	};

	//Deleting Array Item
	let ctrlDeleteItem = function(event){
		let itemID, splitID, type, id;
		//get item ID
		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		//check if itemID is presence
		if(itemID){

			//split itemID
			splitID = itemID.split('-');
			type = splitID[0];
			id = parseInt(splitID[1]);

			//1. Delete item from data
			budgetCtrl.deleteItem(type,id);

			//2. Delete item from UI
			UICtrl.deleteListItem(itemID);

			//3. Update and show new budget
			ctrlUpdateBudget();


		}
	}

	return {
		//Initilize  our Interface
		init: function(){
			//call eventlisteners
			UICtrl.displayMonth();
			UICtrl.displayBudget({
				budget: 0,
				totalCredit: 0,
				totalDebit: 0,
				perentage: -1,
			});
			eventListernerGroup();


		}
	}

	


})(budgetController, UIController);

//Make the initialization Call
Interface.init();