import React, {useState, useContext, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'

import MapContext from './map'

const ParcellesContext = React.createContext()

let LOAD = false

export function ParcellesContextProvider(props) {
  const {map} = useContext(MapContext)

  const [isParcelleSelectionEnable, setIsParcelleSeletionEnable] = useState(false)
  const [selectedParcelles, setSelectedParcelles] = useState([])
  const [hoveredParcelle, setHoveredParcelle] = useState(null)
  const [isLayerLoaded, setIsLayerLoaded] = useState(false)

  const handleParcelle = parcelle => {
    setSelectedParcelles(parcelles => {
      if (selectedParcelles.includes(parcelle)) {
        return selectedParcelles.filter(id => id !== parcelle)
      }

      return [...parcelles, parcelle]
    })
  }

  const handleHoveredParcelle = useCallback(hovered => {
    if (map) {
      setHoveredParcelle(prev => {
        if (prev) {
          map.setFeatureState({source: 'cadastre', sourceLayer: 'parcelles', id: prev.featureId}, {hover: false})
        }

        if (hovered) {
          const featureId = hovered.featureId || map.querySourceFeatures('cadastre', {
            sourceLayer: 'parcelles', filter: ['==', ['get', 'id'], hovered.id]
          })[0].id

          map.setFeatureState({source: 'cadastre', sourceLayer: 'parcelles', id: featureId}, {hover: true})
          return {id: hovered.id, featureId}
        }

        return null
      })
    }
  }, [map])

  const highlightParcelles = useCallback(parcelles => {
    if (map && isLayerLoaded) {
      const filters = isParcelleSelectionEnable ?
        ['any', ...parcelles.map(id => ['==', ['get', 'id'], id])] :
        ['==', ['get', 'id'], '']
      map.setFilter('parcelle-highlighted', filters)
    }
  }, [map, isLayerLoaded, isParcelleSelectionEnable])

  // Use state to know when parcelle-highlighted layer is loaded
  const handleLoad = useCallback(() => {
    const layer = map.getLayer('parcelle-highlighted')
    setIsLayerLoaded(Boolean(layer))
  }, [map, setIsLayerLoaded])

  // Clean hovered parcelle when selection is disabled
  useEffect(() => {
    if (!isParcelleSelectionEnable && map) {
      setHoveredParcelle(prev => {
        if (prev) {
          map.setFeatureState({source: 'cadastre', sourceLayer: 'parcelles', id: prev.featureId}, {hover: false})
          return null
        }
      })
    }
  }, [map, isParcelleSelectionEnable, hoveredParcelle])

  // Reset IsLayerLoaded when selection is disabled
  useEffect(() => {
    if (!isParcelleSelectionEnable) {
      setIsLayerLoaded(false)
    }
  }, [isParcelleSelectionEnable])

  // Updates highlighted parcelles when parcelles changes
  // or when selection is enabled/disabled
  useEffect(() => {
    highlightParcelles(selectedParcelles)
  }, [isParcelleSelectionEnable, selectedParcelles, highlightParcelles])

  // Look styledata event
  // to know if parcelle-highlighted layer is loaded or not
  useEffect(() => {
    if (map && !LOAD) {
      LOAD = true
      map.on('styledata', handleLoad)
    }

    return () => {
      if (map) {
        map.off('styledata', handleLoad)
      }
    }
  }, [map, handleLoad])

  return (
    <ParcellesContext.Provider
      value={{
        selectedParcelles,
        setSelectedParcelles,
        isParcelleSelectionEnable,
        setIsParcelleSeletionEnable,
        handleParcelle,
        hoveredParcelle,
        handleHoveredParcelle
      }}
      {...props}
    />
  )
}

ParcellesContextProvider.defaultProps = {
  codeCommune: null
}

ParcellesContextProvider.propTypes = {
  codeCommune: PropTypes.string
}

export default ParcellesContext
