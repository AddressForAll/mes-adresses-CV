import {useEffect, useContext} from 'react'
import PropTypes from 'prop-types'
import {sortBy} from 'lodash'
import {Pane, Spinner, Table} from 'evergreen-ui'

import {normalizeSort} from '@/lib/normalize'

import BalDataContext from '@/contexts/bal-data'
import TokenContext from '@/contexts/token'

import useFuse from '@/hooks/fuse'
import useInfiniteScroll from '@/hooks/infinite-scroll'

import TableRow from '@/components/table-row'
import VoieEditor from '@/components/bal/voie-editor'

function VoiesList({voies, editedId, onEnableEditing, onSelect, onCancel, setToRemove}) {
  const {token} = useContext(TokenContext)
  const {isEditing} = useContext(BalDataContext)

  const [filtered, setFilter] = useFuse(voies, 200, {
    keys: [
      'nom'
    ]
  })
  const [list, handleScroll, setItems, limit] = useInfiniteScroll(filtered, 15)

  useEffect(() => {
    setItems(filtered)
  }, [filtered, setItems])

  return (
    <Pane flex={1} overflowY='scroll' onScroll={handleScroll}>
      <Table>
        <Table.Head>
          <Table.SearchHeaderCell
            placeholder='Rechercher une voie'
            onChange={setFilter}
          />
        </Table.Head>
        {list.length === 0 && (
          <Table.Row>
            <Table.TextCell color='muted' fontStyle='italic'>
              Aucun résultat
            </Table.TextCell>
          </Table.Row>
        )}
        {sortBy(list, v => normalizeSort(v.nom))
          .map(voie => voie._id === editedId ? (
            <Table.Row key={voie._id} height='auto'>
              <Table.Cell display='block' padding={0} background='tint1'>
                <VoieEditor initialValue={voie} closeForm={onCancel} />
              </Table.Cell>
            </Table.Row>
          ) : (
            <TableRow
              key={voie._id}
              label={voie.nom}
              nomAlt={voie.nomAlt}
              isEditingEnabled={Boolean(!isEditing && token)}
              actions={{
                onSelect: () => onSelect(voie._id),
                onEdit: () => onEnableEditing(voie._id),
                onRemove: () => setToRemove(voie._id)
              }}
            />
          ))}

        {limit < filtered.length && (
          <Pane display='flex' justifyContent='center' marginY={16}><Spinner /></Pane>
        )}
      </Table>
    </Pane>
  )
}

VoiesList.propTypes = {
  voies: PropTypes.array.isRequired,
  editedId: PropTypes.string,
  setToRemove: PropTypes.func.isRequired,
  onEnableEditing: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

VoiesList.defaultProps = {
  editedId: null
}

export default VoiesList
