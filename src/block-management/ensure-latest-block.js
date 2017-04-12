"use strict";

var onNewBlock = require("../block-management/on-new-block");
var eth = require("../wrappers/eth");
var isFunction = require("../utils/is-function");

/**
 * Ensures that `this.block` contains the latest block.
 */
function ensureLatestBlock(callback) {
  return function (dispatch) {
    var block;
    if (!isFunction(callback)) {
      block = dispatch(eth.getBlockByNumber(["latest", false]));
      if (block && !block.error && !(block instanceof Error)) {
        dispatch(onNewBlock(block));
        return block;
      }
    } else {
      dispatch(eth.getBlockByNumber(["latest", false], function (block) {
        if (block && !block.error) {
          dispatch(onNewBlock(block));
          callback(block);
        }
      }));
    }
  };
}

module.exports = ensureLatestBlock;
