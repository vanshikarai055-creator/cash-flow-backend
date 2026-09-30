const express = require("express");

const {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    patchTransaction,
    deleteTransaction,
    filterTransactions
} = require("../controllers/transactioncontroller");

const authMiddleware = require("../middlewares/authmiddleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createTransaction
);
router.get("/",authMiddleware,getAllTransactions);
router.get("/filter", authMiddleware, filterTransactions);
router.get("/:id", authMiddleware, getTransactionById);
router.put("/:id",authMiddleware,updateTransaction);
router.patch(
    "/:id",
    authMiddleware,
    patchTransaction
);
router.delete("/:id",authMiddleware,deleteTransaction);


module.exports = router;