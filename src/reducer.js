export const initialState = { //initial state will be null
    user: null
};

export const actionTypes = { //Push info into datalayer (user signs in , it will push the user into the datalayer)
    SET_USER: "SET_USER",
};

const reducer = (state, action) => { 
    console.log(action);
    switch(action.type) {
        case actionTypes.SET_USER:
            return {
                ...state, //Keep the state of the dl but change the user that is dispatched
                user: action.user
            };
            default: return state;

    }
};

export default reducer;