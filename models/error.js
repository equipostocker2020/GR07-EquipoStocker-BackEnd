/**
 * @swagger
 * components:
 *  schemas:
 *      Error:
 *          type: object
 *          properties:
 *              ok:
 *                  type: boolean
 *              mensaje:
 *                  type: string
 *              error:
 *                  type: object
 *                  properties:
 *                      mensaje:
 *                          type: string
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      Errors:
 *          type: object
 *          properties:
 *              ok:
 *                  type: boolean
 *              mensaje:
 *                  type: string
 *              errors:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          mensaje:
 *                              type: string
 */