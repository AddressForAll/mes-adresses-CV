import React, {useState, useContext, useEffect, useCallback, useMemo} from 'react'
import PropTypes from 'prop-types'

import MapContext from './map'

const ParcellesContext = React.createContext()

let LOAD = false

function getHoveredFeatureId(map, id) {
  const features = map.querySourceFeatures('cadastre', {
    sourceLayer: 'parcelles', filter: ['==', ['get', 'id'], id]
  })
  const [feature] = features
  return feature?.id
}

export function ParcellesContextProvider(props) {
  const {map, isCadastreDisplayed} = useContext(MapContext)
  const {commune} = props

  const [isParcelleSelectionEnabled, setIsParcelleSelectionEnabled] = useState(false)
  const [selectedParcelles, setSelectedParcelles] = useState([])
  const [hoveredParcelle, setHoveredParcelle] = useState(null)
  const [isLayerLoaded, setIsLayerLoaded] = useState(false)

  const handleParcelle = useCallback(parcelle => {
    if (isParcelleSelectionEnabled) {
      setSelectedParcelles(parcelles => {
        if (selectedParcelles.includes(parcelle)) {
          return selectedParcelles.filter(id => id !== parcelle)
        }

        return [...parcelles, parcelle]
      })
    }
  }, [selectedParcelles, isParcelleSelectionEnabled])

  const handleHoveredParcelle = useCallback(hovered => {
    if (map) {
      setHoveredParcelle(prev => {
        if (prev && isCadastreDisplayed) {
          map.setFeatureState({source: 'cadastre', sourceLayer: 'parcelles', id: prev.featureId}, {hover: false})
        }

        if (hovered) {
          const featureId = hovered.featureId || getHoveredFeatureId(map, hovered.id)

          if (featureId && isCadastreDisplayed) {
            map.setFeatureState({source: 'cadastre', sourceLayer: 'parcelles', id: featureId}, {hover: true})
          }

          return {id: hovered.id, featureId}
        }

        return null
      })
    }
  }, [map, isCadastreDisplayed])

  const highlightParcelles = useCallback(parcelles => {
    if (map && isLayerLoaded && isCadastreDisplayed) {
      const filters = isParcelleSelectionEnabled ?
        ['any', ...parcelles.map(id => ['==', ['get', 'id'], id])] :
        ['==', ['get', 'id'], '']
      map.setFilter('parcelle-highlighted', filters)
    }
  }, [map, isLayerLoaded, isParcelleSelectionEnabled, isCadastreDisplayed])

  // Use state to know when parcelle-highlighted layer is loaded
  const handleLoad = useCallback(() => {
    const layer = map.getLayer('parcelle-highlighted')
    setIsLayerLoaded(Boolean(layer))
  }, [map, setIsLayerLoaded])

  // Clean hovered parcelle when selection is disabled
  useEffect(() => {
    if (!isParcelleSelectionEnabled && map) {
      setHoveredParcelle(prev => {
        if (prev) {
          map.setFeatureState({source: 'cadastre', sourceLayer: 'parcelles', id: prev.featureId}, {hover: false})
          return null
        }
      })
    }
  }, [map, isParcelleSelectionEnabled, hoveredParcelle])

  const filterLayer = useCallback((layer, codeCommune) => {
    const filter = ['match', ['get', 'commune']]
    filter.push(codeCommune, true, false)

    map.setFilter(layer, filter)
  }, [map])

  // Reset IsLayerLoaded when selection is disabled
  useEffect(() => {
    if (!isParcelleSelectionEnabled) {
      setSelectedParcelles([])
      setIsLayerLoaded(false)
    }
  }, [isParcelleSelectionEnabled])

  useEffect(() => {
    if (map && isLayerLoaded && isParcelleSelectionEnabled) {
      filterLayer('parcelles', commune?.code)
      filterLayer('parcelles-fill', commune?.code)
    }
  }, [map, isLayerLoaded, isParcelleSelectionEnabled, filterLayer, commune])

  // Updates highlighted parcelles when parcelles changes
  // or when selection is enabled/disabled
  useEffect(() => {
    highlightParcelles(selectedParcelles)
  }, [isParcelleSelectionEnabled, isLayerLoaded, selectedParcelles, highlightParcelles])

  // Look styledata event
  // to know if parcelle-highlighted layer is loaded or not
  useEffect(() => {
    if (map && !LOAD) {
      LOAD = true
      map.on('styledata', handleLoad)
      map.on('styledataloading', handleLoad)
    }

    return () => {
      if (map) {
        map.off('styledata', handleLoad)
        map.off('styledataloading', handleLoad)
      }
    }
  }, [map, handleLoad])

  const value = useMemo(() => ({
    selectedParcelles, setSelectedParcelles,
    isParcelleSelectionEnabled, setIsParcelleSelectionEnabled,
    handleParcelle,
    hoveredParcelle, handleHoveredParcelle
  }), [
    selectedParcelles,
    isParcelleSelectionEnabled,
    handleParcelle,
    hoveredParcelle,
    handleHoveredParcelle
  ])

  return (
    <ParcellesContext.Provider value={value} {...props} />
  )
}

ParcellesContextProvider.propTypes = {
  commune: PropTypes.string
}

ParcellesContextProvider.defaultProps = {
  commune: null
}

export default ParcellesContext
