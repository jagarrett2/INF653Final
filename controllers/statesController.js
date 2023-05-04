const State = require('../model/States');

const data = {
    states: mergeStates(require('../model/states.json'))
}

async function mergeStates(states){
    let stateCode = "";
    const dbStates = await State.find();
    dbStates.forEach((dbState) => {
        stateCode = dbState['stateCode'];
        states.forEach((state) => {
            if(state['code'] == stateCode){
                state['funfacts'] = dbState['funfacts'];
            }
        })
    });
    return states;
}

const getAllStates = async (req, res) => {
    const contig = req.query.contig;
    let states = await data.states;
    if(contig == "true"){
        states = states.filter(item => item['code'] !== 'AK' && item['code'] !== 'HI');
    }
    else if(contig == "false"){
        states = states.filter(item => item['code'] == 'AK' || item['code'] == 'HI');
    }
    res.json(states);
}


const getState = async (req, res) => {
    if (!req?.params?.state) return res.status(400).json({ 'message': 'Invalid state abbreviation parameter' });
    const stateParam = req.params.state.toLowerCase();
    const states = await data.states;

    const state = states.filter(item => item.code.toLowerCase() == stateParam)[0]
    if (!state) {
        return res.status(400).json({ "message": `Invalid state abbreviation parameter` });
    }
    res.json(state);
}

const getFunFact = async (req, res) => {
    if (!req?.params?.state) return res.status(400).json({ 'message': 'State ID required.' });
    const stateParam = req.params.state.toLowerCase();
    const states = await data.states;

    const state = states.filter(item => item.code.toLowerCase() == stateParam)[0];
    if (!state) {
        return res.status(400).json({ "message": `Invalid state abbreviation parameter` });
    }

    if (!state.hasOwnProperty("funfacts")){
        return res.status(400).json({ "message": `No Fun Facts found for ${state.state}` });
    }
    const randomIndex = Math.floor(Math.random() * state.funfacts.length);
    res.json({"funfact": state.funfacts[randomIndex]});
}

const getCapital = async (req, res) => {
    if (!req?.params?.state) return res.status(400).json({ 'message': 'State ID required.' });
    const stateParam = req.params.state.toLowerCase();
    const states = await data.states;

    const state = states.filter(item => item.code.toLowerCase() == stateParam)[0];
    if (!state) {
        return res.status(400).json({ "message": `Invalid state abbreviation parameter` });
    }

    if (!state.hasOwnProperty("capital_city")){
        return res.status(400).json({ "message": `Invalid state abbreviation parameter` });
    }
    res.json({"state": state.state, "capital": state.capital_city});
}

const getNickname = async (req, res) => {
    if (!req?.params?.state) return res.status(400).json({ 'message': 'State ID required.' });
    const stateParam = req.params.state.toLowerCase();
    const states = await data.states;

    const state = states.filter(item => item.code.toLowerCase() == stateParam)[0];
    if (!state) {
        return res.status(400).json({ "message": `Invalid state abbreviation parameter` });
    }

    if (!state.hasOwnProperty("nickname")){
        return res.status(400).json({ "message": `Invalid state abbreviation parameter` });
    }

    res.json({"state": state.state, "nickname": state.nickname});
}

const getPopulation = async (req, res) => {
    if (!req?.params?.state) return res.status(400).json({ 'message': 'State ID required.' });
    const stateParam = req.params.state.toLowerCase();
    const states = await data.states;

    const state = states.filter(item => item.code.toLowerCase() == stateParam)[0];
    if (!state) {
        return res.status(400).json({ "message": `Invalid state abbreviation parameter` });
    }

    if (!state.hasOwnProperty("population")){
        return res.status(400).json({ "message": `Invalid state abbreviation parameter` });
    }
    
    res.json({"state": state.state, "population": state.population});
}

const getAdmission = async (req, res) => {
    if (!req?.params?.state) return res.status(400).json({ 'message': 'State ID required.' });
    const stateParam = req.params.state.toLowerCase();
    const states = await data.states;

    const state = states.filter(item => item.code.toLowerCase() == stateParam)[0];
    if (!state) {
        return res.status(400).json({ "message": `Invalid state abbreviation parameter` });
    }

    if (!state.hasOwnProperty("admission_date")){
        return res.status(400).json({ "message": `Invalid state abbreviation parameter` });
    }
    
    res.json({"state": state.state, "admitted": state.admission_date});
}


const createNewState = async (req, res) => {
    if (!req?.body?.statecode) {
        return res.status(400).json({ 'message': 'State Code is required' });
    }

    try {
        const result = await State.create({
            stateCode: req.body.statecode,
            funfacts: req.body.funfacts
        });

        res.status(201).json(result);
    } catch (err) {
        res.json(err);
    }
}

const updateState = async (req, res) => {
    if (!req?.body?.statecode) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const state = await State.findOne({ stateCode: req.body.statecode }).exec();
    if (!state) {
        return res.status(204).json({ "message": `No state matches ID ${req.body.id}.` });
    }
    if (req.body?.statecode) state.stateCode = req.body.statecode;
    if (req.body?.funfacts) state.funfacts = req.body.funfacts;
    const result = await state.save();
    res.json(result);
}

const deleteState = async (req, res) => {
    if (!req?.body?.statecode) return res.status(400).json({ 'message': 'State code required.' });

    const state = await State.findOne({ _id: req.body.statecode }).exec();
    if (!state) {
        return res.status(204).json({ "message": `No state matches statecode ${req.body.id}.` });
    }
    const result = await state.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}


module.exports = {
    getAllStates,
    createNewState,
    updateState,
    deleteState,
    getState,
    getFunFact,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission
}