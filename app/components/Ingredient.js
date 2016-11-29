import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { toggleAddDelete } from  '../actions'

const Ingredient = (props) => {
  const imgBaseURL = 'https://spoonacular.com/cdn/ingredients_100x100/'
  const imageURL = imgBaseURL + props.ingredient.image
  const name = props.ingredient.name
  const dataPlacement = (props.display === 'index') ? 'right' : 'left'
  const buttonClass = props.isAdded ? 'added' : ''
  const tooltipHTML = '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div>' +
    '<div class="tooltip-inner success"></div></div>'
  return (
    <li className="media ingredient" onMouseDown={e => e.preventDefault()}>
      <div className="media-left media-middle">
        <img className="img-rounded" src={imageURL} alt="40x40" width="40" height="40"/>
      </div>
      <div className="media-body">
        <div className="ingr-name-overlay"></div>
        <div className="ingr-name-wrapper">
          <p className="media-heading">{name}</p>
        </div>
      </div>
      <div className="media-right media-middle">
        <button
          id={props.idName}
          onClick={props.toggleAddDelete(props.ingredient)}
          className={`btn btn-default btn-add ${buttonClass}`}
          title={props.message}
          data-placement={dataPlacement}
          data-template={tooltipHTML}
        >
          <i className="fa fa-2x fa-plus btn-add-icon"/>
        </button>
      </div>
    </li>
  )
}

Ingredient.propTypes = {
  ingredient: React.PropTypes.shape({
    id: React.PropTypes.number.isRequired,
    name: React.PropTypes.string.isRequired,
    image: React.PropTypes.string.isRequired,
    isAdded: React.PropTypes.bool.isRequired
  }).isRequired,
  idName: React.PropTypes.string.isRequired,
  message: React.PropTypes.string,
  toggleAddDelete: React.PropTypes.func.isRequired,
  display: React.PropTypes.oneOf(['index', 'dash']),
}

const mapStateToProps = state => {
  return {
    message: state.message,
    display: state.display
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    toggleAddDelete
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Ingredient)
