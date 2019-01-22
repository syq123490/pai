// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
// BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// module dependencies
const Joi = require('joi');
const yaml = require('js-yaml');
const fs = require('fs');
const logger = require('./logger');

function updateMachineList() {
    let paiMachineList = [];
    try {
        paiMachineList = yaml.safeLoad(fs.readFileSync('/pai-cluster-config/cluster-configuration.yaml', 'utf8'))['machine-list'];
    } catch (err) {
        paiMachineList = [];
        logger.info('Unable to load machine list from cluster-configuration.');
        logger.info(err.stack);
    }

    let paiConfigData = {
        machineList: paiMachineList,
    };


    // define the schema for pai configuration
    const paiConfigSchema = Joi.object().keys({
        machineList: Joi.array(),
    }).required();


    const {error, value} = Joi.validate(paiConfigData, paiConfigSchema);
    if (error) {
        throw new Error(`config error\n${error}`);
    }
    paiConfigData = value;

    module.exports = paiConfigData;
    logger.info("Machine list for az-rdma is updated.")
}

updateMachineList();
// Execute every 10 mins
setInterval(updateMachineList, 600000);


