import React, {useCallback, useContext} from 'react'
import PropTypes from 'prop-types'
import {css} from 'glamor'
import randomColor from 'randomcolor'

import useError from '../../hooks/error'

import {removeNumero} from '../../lib/bal-api'

import TokenContext from '../../contexts/token'
import BalDataContext from '../../contexts/bal-data'

import NumeroMarker from './numero-marker'

function NumerosMarkers({numeros, voie, showLabel, showContextMenu, setShowContextMenu}) {
  const [setError] = useError()

  const {token} = useContext(TokenContext)
  const {setEditingId, isEditing, reloadNumeros, reloadNumerosToponyme} = useContext(BalDataContext)

  const onEnableEditing = useCallback((e, numeroId) => {
    e.stopPropagation()

    if (!isEditing) {
      setEditingId(numeroId)
    }
  }, [setEditingId, isEditing])

  const colorSeed = useCallback(id => {
    return id ? randomColor({
      luminosity: 'dark',
      seed: id
    }) : '#1070ca'
  }, [])

  const markerStyle = useCallback(colorSeed => css({
    borderRadius: 20,
    marginTop: -10,
    marginLeft: -10,
    color: 'transparent',
    whiteSpace: 'nowrap',
    background: showLabel ? 'rgba(0, 0, 0, 0.7)' : null,
    cursor: 'pointer',

    '&:before': {
      content: ' ',
      backgroundColor: colorSeed,
      border: '1px solid white',
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: '50%',
      marginLeft: 6
    },

    '& > span, & > svg': {
      display: showLabel ? 'inline-block' : 'none'
    },

    '&:hover': showLabel ? null : {
      background: 'rgba(0, 0, 0, 0.7)',

      '& > span, & > svg': {
        display: 'inline-block'
      }
    }
  }), [showLabel])

  const removeAddress = useCallback(async numeroId => {
    try {
      await removeNumero(numeroId, token)
      if (voie) {
        await reloadNumeros()
      } else {
        await reloadNumerosToponyme()
      }
    } catch (error) {
      setError(error.message)
    }

    setShowContextMenu(null)
  }, [token, reloadNumeros, setError, setShowContextMenu])

  return (
    numeros.map(numero => (
      <NumeroMarker
        key={numero._id}
        numero={numero}
        style={markerStyle(colorSeed(numero.voie?._id || voie?._id))}
        showContextMenu={numero._id === showContextMenu}
        setShowContextMenu={setShowContextMenu}
        removeAddress={removeAddress}
        onEnableEditing={onEnableEditing}
      />
    ))
  )
}

NumerosMarkers.propTypes = {
  numeros: PropTypes.array.isRequired,
  voie: PropTypes.shape({
    _id: PropTypes.string.isRequired
  }),
  showLabel: PropTypes.bool.isRequired,
  showContextMenu: PropTypes.string,
  setShowContextMenu: PropTypes.func.isRequired
}

export default NumerosMarkers
