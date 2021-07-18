use strict';

const {Contract} = require('fabric-contract-api');
const ClientIdentity = require("fabric-shim").ClientIdentity;

class studentContract extends Contract {

	constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.learning-network.learnnet.teachers');
	}

	/* ****** All custom functions are defined below ***** */

	// This is a basic user defined function used at the time of instantiating the smart contract
	// to print the success message on console
	async instantiate(ctx) {
		console.log('Teacher Smart Contract Instantiated');
	}

/**
	 * Create a new student account on the network
	 * @param ctx - The transaction context object
	 * @param studentId - ID to be used for creating a new student account
	 * @param name - Name of the student
	 * @param email - Email ID of the student
	 * @returns
	 */
	async EnrollStudent(ctx, studentId, name, email) {
		// Create a new composite key for the new student account
		const studentKey = ctx.stub.createCompositeKey('org.learning-network.learnnet.students', [studentId]);

		// Create a student object to be stored in blockchain
		let newStudentObject = {
			studentId: studentId,
			name: name,
			email: email,
			createdAt: new Date(),
			updatedAt: new Date(),
      learntoken: parseInt(0),
		};

		// Convert the JSON object to a buffer and send it to blockchain for storage
		let dataBuffer = Buffer.from(JSON.stringify(newStudentObject));
		await ctx.stub.putState(studentKey, dataBuffer);
		// Return value of new student account created to user
		return newStudentObject;
	}


  /**
  	 * Create a new student account on the network
  	 * @param ctx - The transaction context object
  	 * @param studentId - ID to be used for creating a new student account
  	 * @param name - Name of the student
  	 * @param email - Email ID of the student
  	 * @returns
  	 */
  	async createTestRequest(ctx, studentId, testId) {
  		// Create a new composite key for the new student account
  		const studentKey = ctx.stub.createCompositeKey('org.learning-network.learnnet.students', [studentId]);

  		// Create a student object to be stored in blockchain
  		let newStudentObject = {
  			studentId: studentId,
  			name: name,
  			email: email,
  			createdAt: new Date(),
  			updatedAt: new Date(),
        learntoken: parseInt(0),
  		};

  		// Convert the JSON object to a buffer and send it to blockchain for storage
  		let dataBuffer = Buffer.from(JSON.stringify(newStudentObject));
  		await ctx.stub.putState(studentKey, dataBuffer);
  		// Return value of new student account created to user
  		return newStudentObject;
  	}



  /**
   * Get Property Details registered over the network
   * @param propertyID - Identifer of real world property
   * @returns {property object}
   */
  async testRequest(ctx, test){

   const propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users.property',[PropertyID]);

   // Return value of property object in buffer form from blockchain
   let PropertyBuffer = await ctx.stub
       .getState(propertyKey)
       .catch(err => console.log(err));

       if(PropertyBuffer){
         return JSON.parse(PropertyBuffer.toString());
       }
       else { throw new Error('The property is not registered on the network');
       }
     }
}


  asyc sendTestResponse(ctx,studentId, testId, Testresponse){


  }
