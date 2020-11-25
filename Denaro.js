$(document).ready(function() {
  
  class ExpenseCalc {
    constructor(type, num) {
      this._type = type; 
      this.num = num; 
      this.inputsAm = document.getElementsByClassName(this._type + "Amount"); //returns an array-like object listing all input elements in each resp Amount column
      this.inputsEx = document.getElementsByClassName(this._type + "Expense"); //returns an array-like object listing all input elements in each resp Expense column
      this.selectOp = document.getElementsByClassName(this._type + "Category"); // same thing for select elements
      this.inputsArray = Array.from(this.inputsAm); // Allows array methods to be used on input numbers
      this.expenseArray = Array.from(this.inputsEx);
      this.selectArray = Array.from(this.selectOp);
      this.numberArray = [0, 0]; // Keeps track of how many "amount" column inputs there are 
      this.modifiers = [1, 365, 52, 26, 12, 4, 1]; // only used by "income" ExpenseCalc
      this.keyArray = [this.expenseArray[0].value, this.expenseArray[1].value];
      this.total = document.getElementById(this._type + "-total");
      this.sum = 0;
      this.cssHeight = 12; 

      this.library = {};

      this.deleteProp = (prop) => { // takes "prop" (property name) to remove property from library
        delete this.library[prop];
        console.log(this.library);
      }

      this.updateLibrary = () => {
        for (let i = 0; i < this.expenseArray.length; i++) {
          this.library[this.keyArray[i]] = this.numberArray[i];
        }
      }

      this.changeCSSHeight = (id, n, bool) => { // bool = boolean for "true" to add height, "false" to subtract height
        let updateTabH;
        let updateContainerH;
        if (bool) { 
          this.cssHeight += n; 
          if (this.cssHeight > 22) {
            tabBoxH += n;
          }
        } else if (!bool && this.cssHeight < 22) {
          this.cssHeight -= n;
        } else if (!bool && this.cssHeight > 22) {
          this.cssHeight -= n;
          tabBoxH -= n;
        }
        updateTabH = this.cssHeight; 
        this.cssHeight.toString;
        document.getElementById(id + "Calc").style.height = this.cssHeight + "rem";
        this.cssHeight = updateTabH; 
        updateContainerH = tabBoxH;
        tabBoxH.toString;
        tabBox.style.height = tabBoxH + "rem";
        tabBoxH = updateContainerH;
      }

      this.total.innerHTML = "$" + this.sum.toFixed(2);
      this.table = document.getElementById(this._type + "Table");
      this.addBtn = document.getElementById(this._type + "Add");
      this.subBtn = document.getElementById(this._type + "Sub");

      this.addSelect = (newRow, rowIndex) => { // creates select element with appropriate option child elements
        let newCell3 = newRow.insertCell(2); 
        let node3 = document.createElement("select"); 
        let options;
        newCell3.appendChild(node3).setAttribute("class", this._type + "Category");
        node3.setAttribute("id", this._type + "Cat" + rowIndex);
        console.log(rowIndex);
        if (this._type === 'income') {
          options = ['once', 'daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'];
        } else {
          options = ['Housing', 'Transportation', 'Food', 'Utilities', 'Insurance', 'Healthcare', 'Education', 'Saving, Investing, & Debt', 'Personal Spending', 'Entertainment & Recreation', 'Miscellaneous'];
        }
        let optionNodes = []; 
        for (let i = 0; i < options.length; i++) {
          optionNodes[i] = document.createElement("option")
          optionNodes[i].setAttribute("value", options[i]);       
          optionNodes[i].innerHTML = options[i];   
          node3.appendChild(optionNodes[i]);
        }
        this.selectOp;
        this.selectArray.push(node3);
      }
      
      this.addExpense = () => {
        this.changeCSSHeight(this._type, 2.65, true);
        let newRow = this.table.insertRow(this.table.rows.length - 1);
        let newCell1 = newRow.insertCell(0);
        let newCell2 = newRow.insertCell(1);
        this.addSelect(newRow, this.table.rows.length - 3); 
        let node1 = document.createElement("input");
        let node2 = document.createElement("input");
        newCell1.appendChild(node1).setAttribute("class", this._type + "Expense");
        node1.setAttribute("type", "string");
        node1.setAttribute("maxlength", "20");
        node1.setAttribute("value", "New");
        node1.focus();
        node1.select();
        newCell2.appendChild(node2).setAttribute("class", this._type + "Amount");
        node2.setAttribute("type", "string"); // ensures monetary $ value can be displayed as string
        node2.setAttribute("value", "0");
        node2.setAttribute("onfocus", "this.select()");
        this.inputsEx; // add new expense input to HTML collection
        this.inputsAm; // adds new amount input to HTML collection
        this.expenseArray.push(node1);
        this.inputsArray.push(node2);
        this.numberArray.push(parseFloat(node2.value));
        this.keyArray.push(node1.value);
        //console.log(this.numberArray); 
        //console.log(this.keyArray); 
      }

      this.subExpense = () => {
        this.changeCSSHeight(this._type, 2.6, false);
        let lastRow = this.table.rows.length - 2; 
        this.table.deleteRow(lastRow);
        this.deleteProp(this.keyArray[lastRow-1]);
        this.inputsArray.pop();
        this.expenseArray.pop();
        this.numberArray.pop();
        this.keyArray.pop();
        this.selectArray.pop();
        this.sum = this.numberArray.reduce(reducer);
        this.total.innerHTML = addCommas(this.sum.toFixed(2));
        //console.log(this.numberArray);
        //console.log(this.keyArray);
      }

      this.multiply = (slot, numStr) => { // This function is called in 2 different cases (1: any change to income inputs 2: any change to income category)
        let selectElem = document.getElementById(this._type + "Cat" + slot);
        let modifyBy = this.modifiers[selectElem.selectedIndex];
        let thisNum = parseFloat(parseFloat(numStr).toFixed(2)); // stores string as a number
        let modifiedNum = thisNum*modifyBy;
        this.numberArray.splice(slot, 1, modifiedNum);
        this.updateSum(slot);
      }

      this.calculateSum = (slot) => {  // "slot" is the index number of the Object.inputsArray
        if (isNaN(this.inputsArray[slot].value) || this.inputsArray[slot].value < 0 || this.inputsArray[slot].value === "" || null) {
          this.inputsArray[slot].value = 0;
        } 
        let thisNum = parseFloat(parseFloat(this.inputsArray[slot].value).toFixed(2)); // stores string as a number
        if (this._type === 'income') { 
          this.multiply(slot, this.inputsArray[slot].value);
        } else {
          this.numberArray.splice(slot, 1, thisNum);
          this.updateSum(slot);
        } 
      }

      this.updateSum = (slot) => { // Updates Total and display Value of input
        this.sum = this.numberArray.reduce(reducer);
        console.log(this.numberArray);
        this.total.innerHTML = "$" + addCommas(this.sum.toFixed(2)); 
        this.inputsArray[slot].value = "$" + addCommas(parseFloat(remove$Sign(this.inputsArray[slot].value)).toFixed(2)); // returns a string to display in input field
      }

      this.spliceKey = (slot) => { // "slot" is the index number of the Object.expenseArray
        let newStr = this.expenseArray[slot].value;
        this.keyArray.splice(slot, 1, newStr);
      }
    }
  }

  const income = new ExpenseCalc('income', 0); // NOTE: for the Income Object, the left column inputs are still referred to as "expenses" in each associated variable
  const week = new ExpenseCalc('week', 52);
  const month = new ExpenseCalc('month', 12);
  const year = new ExpenseCalc('year', 1);
  const tabBox = document.getElementById("tabBox");
  let tabBoxH = 25.5;
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const calcArray = [income, week, month, year];


  

  for (let o = 0; o < calcArray.length; o++) { // Loops through 3 tables and attaches event handlers
    calcArray[o].updateLibrary(); 

    calcArray[o].addBtn.onclick = () => {
      calcArray[o].addExpense();
    }
    calcArray[o].subBtn.onclick = () => {
      if (calcArray[o].table.rows.length > 3) {
        calcArray[o].subExpense(); 
      } else {
        console.log("You must have at least one table row");
      }
      calcArray[o].subBtn.blur();
    }

    calcArray[o].table.oninput = checkInput;
    function checkInput(e) { // Event listener to limit input to 10 digits
      if (e.target.className === calcArray[o]._type + "Amount") {
        let x = calcArray[o].inputsArray.indexOf(e.target);
        if (calcArray[o].inputsArray[x].value.length > 10) {
          calcArray[o].inputsArray[x].value = calcArray[o].inputsArray[x].value.slice(0,10); 
        }
      } // else if (some condition for unaccepted "Expense" string) - if needed?
    }

    calcArray[o].table.onchange = calc;
    function calc(e) { // Calls calculateSum method when event target (Amount input) changes
      if (e.target.className === calcArray[o]._type + "Amount") {
        console.log(calcArray[o].inputsArray.indexOf(e.target)); // this is the "slot" argument (zero index of row of input/select elements
        calcArray[o].calculateSum(calcArray[o].inputsArray.indexOf(e.target));
        calcArray[o].updateLibrary(); 
      } else if (e.target.className === calcArray[o]._type + "Expense") { // Handles user value change for "expense" string in left column
        calcArray[o].deleteProp(calcArray[o].keyArray[calcArray[o].expenseArray.indexOf(e.target)]); // changes key name before key is spliced
        //console.log(calcArray[o].keyArray[calcArray[o].expenseArray.indexOf(e.target)]); //returns the string prop name
        calcArray[o].spliceKey(calcArray[o].expenseArray.indexOf(e.target));
        calcArray[o].updateLibrary();
      } else if (e.target.className === "incomeCategory") { // Handles user selection changes to dropdown category select options (right column)
        let currentNumString = calcArray[o].inputsArray[calcArray[o].selectArray.indexOf(e.target)].value;
        let newNumString = remove$Sign(currentNumString);
        calcArray[o].multiply(calcArray[o].selectArray.indexOf(e.target), newNumString);
      }
    }
  } 
  
  function addCommas(str) { // Adds commas to string if length is > 6
    if (typeof str === "string" && str.length > 6) { 
      let numArr = str.split(""); 
      for (let d = numArr.length - 5; d >= 2; d -= 3) {
        numArr.splice(d-1, 0, ",");
      }
      let commaStr = numArr.reduce(reducer); 
      return commaStr;
    }
    return str;
  }

  function remove$Sign(str) { // Removes $ sign from passed string, and also removes commas in length is >= 9 characters
    if (str === "0") {
      return str;
    }
    let strArr = str.split(''); 
    if (strArr.length >= 9) {
      for (let i = 0; i < strArr.length; i++) {
        if (strArr[i] === ",") {
          strArr.splice(i, 1);
        } else if (strArr[i] !== ",") {
          strArr[i] = strArr[i];
        }
      }
    }
    if (strArr[0] === "$") {
      strArr.shift();
      let newStr = strArr.reduce(reducer); 
      return newStr;
    } else {
      return str;
    }
  }


});

// Create "Income Sources" section/Class 
// Combine Income and Expense data to create over/under budget result
// Include option for "printing", "saving" or "downloading" results into different file types
  