import React, {Component} from 'react';
import Button from '../button';

import './styles.scss';

const INITIAL_STATE = {
    input: '',
    output: '',
    shouldOverwrite: true,
    lastSymbolType: null,
    parenthesesBalance: 0
};

const BUTTONS = [
    ['^', 'operator'],
    ['(', 'openedParenthesis'],
    [')', 'closedParenthesis'],
    ['C', 'clear'],
    ['⌫', 'delete'],
    ['7', 'digit'],
    ['8', 'digit'],
    ['9', 'digit'],
    ['×', 'operator'],
    ['4', 'digit'],
    ['5', 'digit'],
    ['6', 'digit'],
    ['÷', 'operator'],
    ['1', 'digit'],
    ['2', 'digit'],
    ['3', 'digit'],
    ['-', 'operator'],
    ['0', 'digit'],
    ['.', 'dot'],
    ['=', 'calculate'],
    ['+', 'operator']
];

class App extends Component {
    constructor(props) {
        super(props);
        this.handleDigit = this.handleDigit.bind(this);
        this.handleOperator = this.handleOperator.bind(this);
        this.handleResult = this.handleResult.bind(this);
        this.clear = this.clear.bind(this);
        this.restoreLastState = this.restoreLastState.bind(this);
        this.handleParenthesis = this.handleParenthesis.bind(this);
        this.handleDot = this.handleDot.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.state = INITIAL_STATE;
        this.history = [];
    }

    componentDidMount() {
        document.body.addEventListener('keypress', this.handleKeyPress);
    }

    componentWillUnmount() {
        document.body.removeEventListener('keypress', this.handleKeyPress);
    }

    render() {
        return (
            <main>
                <div className="screen">
                    <div className="input">{this.state.input}</div>
                    <div className="output">{this.state.output}</div>
                </div>
                <div className="buttons">
                    {
                        BUTTONS.map(([symbol, type, className]) => (
                            <Button
                                key={symbol}
                                buttonKey={symbol}
                                className={className || this.getButtonType(symbol)}
                                disabled={type === 'delete' && this.state.shouldOverwrite}
                                onClick={this.getHandler(type)}
                            />
                        ))
                    }
                </div>
            </main>
        );
    }

    getButtonType(symbol) {
        switch (symbol) {
        case '^':
        case '(':
        case ')':
        case 'C':
            return 'secondary';
        case '⌫':
        case '×':
        case '÷':
        case '-':
        case '+':
            return 'right-panel';
        default:
            return 'primary';
        }
    }

    getHandler(key) {
        switch (key) {
        case 'digit':
            return this.handleDigit;
        case 'operator':
            return this.handleOperator;
        case 'delete':
            return this.restoreLastState;
        case 'calculate':
            return this.handleResult;
        case 'openedParenthesis':
        case 'closedParenthesis':
            return this.handleParenthesis;
        case 'clear':
            return this.clear;
        case 'dot':
            return this.handleDot;
        default:
            console.error('Check BUTTONS array');
        }
    }

    handleOperator(operator) {
        if ((operator !== '-') &&
            !['digit', 'closedParenthesis'].includes(this.state.lastSymbolType)) {
            return;
        }

        if (![null, 'digit', 'closedParenthesis', 'openedParenthesis']
            .includes(this.state.lastSymbolType)) {
            return;
        }

        this.mySetState({
            ...this.state,
            input: this.state.input + operator,
            shouldOverwrite: false,
            lastSymbolType: 'operator'
        });
    }

    handleDigit(digit) {
        if (/\)$/.test(this.state.input)) {
            return;
        }

        const input = (this.state.shouldOverwrite ? '' : this.state.input) + digit;

        this.mySetState({
            ...this.state,
            input,
            output: calculateResult(input) || this.state.output,
            shouldOverwrite: false,
            lastSymbolType: 'digit'
        });
    }

    handleParenthesis(parenthesis) {
        const isOpened = parenthesis === '(';

        if (isOpened && !['openedParenthesis', 'operator', null]
            .includes(this.state.lastSymbolType)) {
            return;
        }

        if (!isOpened && (!['closedParenthesis', 'digit']
            .includes(this.state.lastSymbolType) ||
                this.state.parenthesesBalance === 0)) {
            return;
        }

        const input = (this.state.shouldOverwrite ? '' : this.state.input) + parenthesis;

        this.mySetState({
            ...this.state,
            input: this.state.input + parenthesis,
            output: calculateResult(input) || this.state.output,
            shouldOverwrite: false,
            lastSymbolType: isOpened ? 'openedParenthesis' : 'closedParenthesis',
            parenthesesBalance: this.state.parenthesesBalance + (isOpened ? 1 : -1)
        });
    }

    handleResult() {
        if (this.state.parenthesesBalance !== 0 || !['closedParenthesis', 'digit']
            .includes(this.state.lastSymbolType)) {
            return;
        }

        this.mySetState({
            ...this.state,
            input: this.state.output || this.state.input,
            output: '',
            shouldOverwrite: true,
            lastSymbolType: 'digit'
        });
        this.history = [];
    }

    handleDot() {
        if (/([^\d]|\d+\.\d*)$/.test(this.state.input)) {
            return;
        }

        if (this.state.shouldOverwrite) {
            return;
        }

        this.mySetState({
            ...this.state,
            input: this.state.input + '.',
            shouldOverwrite: false,
            lastSymbolType: 'dot'
        });
    }

    clear() {
        this.history = [];
        this.setState(INITIAL_STATE);
    }

    mySetState(state) {
        this.history.push({...this.state});
        this.setState(state);
    }

    restoreLastState() {
        const state = this.history.pop();

        if (state) {
            this.setState(state);
        }
    }

    handleKeyPress(e) {
        switch (e.key) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            this.handleDigit(e.key);
            break;
        case '+':
        case '-':
        case '*':
        case '/':
            this.handleOperator(e.key.replace('/', '÷').replace('*', '×'));
            break;
        case 'Backspace':
            this.restoreLastState('Del');
            break;
        case 'Enter':
        case '=':
            this.handleResult();
            break;
        default:
            break;
        }
}
}

function calculateResult(input) {
    try {
        // eslint-disable-next-line no-eval
        const result = eval(input
            .replace(/×/g, '*')
            .replace(/\^/g, '**')
            .replace(/÷/g, '/')).toString();
        if (result === input) {
            return '';
        }

        return result;
    } catch (err) {
        return '';
    }
}

export default App;
