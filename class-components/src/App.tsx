import React from 'react';
import './App.css';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
    this.handleRetry = this.handleRetry.bind(this);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log(`${error} ${errorInfo} `);
  }

  handleRetry() {
    this.setState({ hasError: false });
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <p className="err-text">Something went wrong. Reload page.</p>
          <button onClick={this.handleRetry}>Retry</button>
        </>
      );
    }
    return this.props.children;
  }
}

interface SearchProps {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  searchTerm: string;
}

class Search extends React.Component<SearchProps> {
  render() {
    return (
      <section id="search">
        <input
          type="text"
          id="input-search"
          onChange={this.props.handleChange}
          onKeyDown={this.props.handleKeyPress}
          value={this.props.searchTerm}
        ></input>
        <button id="btn-search" onClick={this.props.handleClick}>
          Search
        </button>
      </section>
    );
  }
}

interface ResultsProps {
  results: { name: string; url: string }[];
}

class Results extends React.Component<ResultsProps> {
  render() {
    if (!this.props.results || this.props.results.length === 0) {
      return <p>No matches found.</p>;
    }
    return (
      <section id="main">
        {this.props.results.map((element, i) => {
          return (
            <DataCell key={i} id={i} name={element.name} url={element.url} />
          );
        })}
      </section>
    );
  }
}

interface DataCellProps {
  id: number;
  name: string;
  url: string;
}

class DataCell extends React.Component<DataCellProps> {
  render() {
    if (!this.props.name || !this.props.url) {
      throw new Error('Data not found.');
    }
    return (
      <div key={`item-${this.props.id}`} className="result-item">
        <p className="result-name">{this.props.name}</p>
        <p className="result-url">{this.props.url}</p>
      </div>
    );
  }
}

interface ErrorBurronsProps {}

interface ErrorButtonState {
  errorSim: boolean;
}

class ErrorButton extends React.Component<ErrorBurronsProps, ErrorButtonState> {
  constructor(props: ErrorBurronsProps) {
    super(props);
    this.state = { errorSim: false };
    this.throwError = this.throwError.bind(this);
  }

  throwError() {
    this.setState({
      errorSim: true,
    });
  }

  render(): React.ReactNode {
    if (this.state.errorSim) {
      throw new Error("That's ok, just error simulation!");
    }
    return (
      <section id="bot">
        <button id="btn-error" onClick={this.throwError}>
          Throw error
        </button>
      </section>
    );
  }
}

interface AppProps {}

interface AppState {
  searchTerm: string;
  results: { name: string; url: string }[];
  errorSim: boolean;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      searchTerm: localStorage.getItem('searchTerm') || '',
      results: [],
      errorSim: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.throwError = this.throwError.bind(this);
  }

  componentDidMount() {
    this.handleClick();
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      searchTerm: e.target.value,
    });
  }

  handleClick() {
    const { searchTerm } = this.state;
    const url: string = `https://pokeapi.co/api/v2/${this.state.searchTerm}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          return 'NotFound';
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          results: data.results,
        });
        localStorage.setItem('searchTerm', searchTerm);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      this.handleClick();
    }
  }

  throwError() {
    this.setState({
      errorSim: true,
    });
  }

  render() {
    return (
      <>
        <ErrorBoundary>
          <Search
            searchTerm={this.state.searchTerm}
            handleChange={this.handleChange}
            handleClick={this.handleClick}
            handleKeyPress={this.handleKeyPress}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <Results results={this.state.results} />
        </ErrorBoundary>
        <ErrorBoundary>
          <ErrorButton />
        </ErrorBoundary>
      </>
    );
  }
}

export default App;
