const store = {
    state: {
        todoItems: [
            { id: 1, content: 'Content-1', activation: true },
            { id: 2, content: 'Content-2', activation: true },
            { id: 3, content: 'Content-3', activation: false },
        ],
    },
    setState (newState) {
        this.state = { ...this.state, ...newState };
    }
}

module.exports = store;