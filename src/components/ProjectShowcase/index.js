import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProjectShowcase extends Component {
  state = {
    apiData: [],
    inputValue: 'ALL',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectsApi()
  }

  getProjectsApi = async () => {
    const {inputValue} = this.state
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${inputValue}`
    console.log(apiUrl)
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    // console.log(response)
    if (response.ok) {
      const data = await response.json()
      //   console.log(data)
      const updatedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        imageUrl: eachProject.image_url,
        name: eachProject.name,
      }))
      this.setState({
        apiData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProjectsSuccessView = () => {
    const {apiData} = this.state

    return (
      <ul className="ul-container">
        {apiData.map(eachProject => (
          <li key={eachProject.id} className="li-element">
            <div>
              <img src={eachProject.imageUrl} alt={eachProject.name} />
              <p>{eachProject.name}</p>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  retryApi = () => {
    this.getProjectsApi()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button onClick={this.retryApi} className="retry-btn" type="button">
        Retry
      </button>
    </div>
  )

  renderAllProjects = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectsSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  getSelectedValue = event => {
    this.setState(
      {
        inputValue: event.target.value,
      },
      this.getProjectsApi,
    )
  }

  render() {
    return (
      <div className="main-container">
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-log-img"
          />
        </nav>
        <div className="bottom-container">
          <select onChange={this.getSelectedValue} className="option">
            {categoriesList.map(eachValue => (
              <option value={eachValue.id} key={eachValue.id}>
                {eachValue.displayText}
              </option>
            ))}
          </select>
          <div>{this.renderAllProjects()}</div>
        </div>
      </div>
    )
  }
}

export default ProjectShowcase
