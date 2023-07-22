const { StatusCodes } = require('http-status-codes')
const { addBank, getBanks, updateBank: updateBankService, deleteBank: deleteBankService } = require("../service/bank")
const { Bank } = require("../../../view/bank/bank")
// const { redisClient, getCacheData } = require("../../../caching/redis")


/**
 * @openapi
 * components:
 *  securitySchemes:
 *    BearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *  schemas:
 *    Banks:
 *      type: object
 *      required:
 *        - fullName
 *        - abbreviation
 *      properties:
 *        id:
 *          type: uuid
 *          description: Autogenerated id for bank
 *        fullName:
 *          type: string
 *          description: Name of the bank
 *        abbreviation:
 *          type: string
 *          description: Short name for the bank
 *        balance:
 *          type: integer
 *          minimum: 100
 *          maximum: 1000
 *          description: Balance of a bank
 *      example:
 *        id: 9079e738-ce85-4189-af97-27f5695b8241
 *        fullName: State Bank of India
 *        abbreviation: SBI
 *  
 *  parameters:
 *    bankID:
 *      in: path
 *      name: bankID
 *      schema: 
 *        type: string
 *      required: true
 *      description: Id of bank on which operation has to be performed.
 *      
 */

/**
 * @openapi
 * tags:
 *  name: Bank
 *  description: API to manage banks
 */

/**
 * @openapi
 * /api/v1/bank-app/banks:
 *  get:
 *    security:
 *      - BearerAuth: []
 *    tags: [Bank]
 *    summary: Returns all the banks.
 *    parameters:
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *          minimum: 1
 *        required: false
 *        description: The number of items to be returned.
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *          minimum: 1
 *        required: false
 *        description: The number of items to skip before starting to collect the result set.
 *    responses:
 *      200:
 *        description: List of banks
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Banks'
 *      400:
 *        description: Bad request
 *      500:
 *        description: if something fails internally then send error
 *
 *  post:
 *    security:
 *      - auth0_jwk: []
 *    tags: [Bank]
 *    summary: Create new bank.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Banks'
 *    responses:
 *      200:
 *        description: Bank successfully created
 *      400:
 *        description: required body is invalid
 *      500:
 *        description: if something fails internally then send error
 * 
 */


/**
 * @openapi
 * /api/v1/bank-app/banks/{bankID}:
 *  put:
 *    security:
 *      - auth0_jwk: []
 *    tags: [Bank]
 *    summary: Update specified bank.
 *    parameters:
 *      - $ref: '#/components/parameters/bankID'
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:  
 *            $ref: '#/components/schemas/Banks'
 *    responses:
 *      200:
 *        description: Bank successfully updated
 *      400:
 *        description: required parameters or body has some error.
 *      500:
 *        description: if something fails internally then send error.
 *  
 *  delete:
 *    security:
 *      - auth0_jwk: []
 *    tags: [Bank]
 *    summary: This will deleted specifed bank.
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: Id of bank that has to be deleted.
  *    responses:
 *      200:
 *        description: Requested bank successfully deleted
 *      400:
 *        description: invalid bankID provided in parameters.
 *      500:
 *        description: if something fails internally then send error.
 *  
 */

const createBank = async (req, res, next) => {
  try {
    const { fullName, abbreviation } = req.body
    const bank = new Bank(fullName, abbreviation)
    await addBank(bank)

    res.status(StatusCodes.CREATED).json(null)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const updateBank = async (req, res, next) => {
  try {
    const bankID = req.params.bankID
    const { fullName, abbreviation } = req.body
    const bank = new Bank(fullName, abbreviation)
    bank.setBankID(bankID)

    await updateBankService(bank)

    res.status(StatusCodes.ACCEPTED).json(null)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const deleteBank = async (req, res, next) => {
  try {
    const bankID = req.params.bankID
    const bank = new Bank()
    bank.setBankID(bankID)

    await deleteBankService(bank)

    res.status(StatusCodes.ACCEPTED).json(null)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

const getAllBanks = async (req, res, next) => {
  try {
    const queryparams = req.query
    const redisQuery = { ...req.query }
    console.log(redisQuery);

    // const response = await redisClient.get(`banks?${JSON.stringify(redisQuery)}`, async (error, banks) => {
    //   console.log("iniside get redis client");
    //   if (error) {
    //     console.error(error);
    //   }
    //   if (banks) {
    //     console.log("inside redis data");
    //     return JSON.parse(banks)
    //   }
    // })

    // const response = await getCacheData(`banks?${JSON.stringify(redisQuery)}`)
    // console.log("after redis client get");

    // if (response) {
    //   res.status(StatusCodes.OK).json(JSON.parse(response))
    //   return
    // }

    // console.log("redis cache not found");
    const banks = await getBanks(queryparams)
    console.log(queryparams);
    // redisClient.setEx(`banks?${JSON.stringify(redisQuery)}`, process.env.DEFAULT_EXPIRATION, JSON.stringify(banks.rows))

    res.setHeader("X-Total-Count", banks.count)
    res.status(StatusCodes.OK).json(banks.rows)
  } catch (error) {
    console.error(error);
    next(error)
  }
}

module.exports = { createBank, getAllBanks, updateBank, deleteBank }