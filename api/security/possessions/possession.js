const Transfer = require('../models/transfer.model');
const Transaction = require('../models/transaction.model');
const Group = require('../models/group.model');
const { roles } = require('../accessControl');
const AppError = require('../error/appError');

function canTouchUser(req, res, next) {
    try {
        if ((req.user.role === roles.ADMIN) || String(req.user._id) === String(req.params.userID)) return next();
        return next(new AppError('AuthError', "You don't have the permission to perform this action", 403));
    } catch (error) {
        return next(error);
    }
}

async function canTouchTransfer(req, res, next) {
    try {
        //TODO: revise the control structure
        let transfer = await Transfer.findById(req.params._id).lean();
        if (req.method === 'POST' && String(req.user._id) === String(transfer.sender)) return next();
        else if (String(req.user._id) === String(transfer.sender) || String(req.user._id) === String(transfer.receiver)) return next();
        return next(new AppError('AuthError', "You don't have the permission to perform this action", 403));
    } catch (error) {
        next(error);
    }
}
async function canTouchTransaction(req, res, next) {
    try {
        //TODO: revise the control structure
        let transaction = await Transaction.findById(req.params.transactionId).lean();
        if (req.user.role==roles.ADMIN) return next();
        else if (String(req.user._id) === String(transaction.user)) return next();
        return next(new AppError('AuthError', "You don't have the permission to perform this action", 403));
    } catch (error) {
        next(error);
    }
}
async function canTouchGroup(req, res, next) {
    try {
        let group = await Group.findById(req.params.id).lean();
        if (String(req.user._id) === String(group.businessUser)) return next();
        return next(new AppError('AuthError', "You don't have the permission to perform this action", 403));
    } catch (error) {
        next(error);
    }
}
async function canTouchCreditCard(req, res, next) {
    try {
        if (req.user.creditCards.find((creditCardId, i) => String(creditCardId) === req.params._id)) return next(); // (req.params._id) is the creditCard's
        return next(new AppError('AuthError', "You don't have the permission to perform this action", 403));
    } catch (error) {
        next(error)
    }
}

export default {
    canTouchUser,
    canTouchTransfer,
    canTouchCreditCard,
    canTouchGroup,
    canTouchTransaction
}