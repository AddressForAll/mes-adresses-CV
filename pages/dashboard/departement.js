import React from 'react'
import PropTypes from 'prop-types'
import {Heading, Pane} from 'evergreen-ui'
import {flatten, groupBy, uniq} from 'lodash'

import {getContoursCommunes, listBALByCodeDepartement} from '../../lib/bal-api'
import {getDepartement, searchCommunesByCode} from '../../lib/geo-api'
import {getBALByStatus} from '../../lib/bases-locales'

import Counter from '../../components/dashboard/counter'
import PieChart from '../../components/dashboard/charts/pie-chart'
import CommuneBALList from '../../components/dashboard/commune-bal-list'
import {expandWithPublished} from '../../helpers/bases-locales'
import DashboardLayout from '../../components/layout/dashboard'

const Departement = ({departement, filteredCommunesInBAL, basesLocalesDepartement, basesLocalesDepartementWithoutTest, BALGroupedByCommune, contoursCommunes}) => {
  const {nom, code} = departement
  const numberCommunesWithoutTest = uniq(flatten(basesLocalesDepartementWithoutTest.map(({communes}) => communes))).length

  const BALByStatus = getBALByStatus(basesLocalesDepartementWithoutTest)

  const mapData = {
    departement: code,
    basesLocales: basesLocalesDepartementWithoutTest,
    contours: contoursCommunes
  }
  return (
    <DashboardLayout backButton title={`Tableau de bord des Bases Adresse Locales - ${nom} (${code})`} mapData={mapData}>
      {basesLocalesDepartement.length >= 1 ? (
        <Pane display='grid' gridGap='2em' padding={8}>
          {numberCommunesWithoutTest > 0 && (
            <Counter
              label={`${numberCommunesWithoutTest > 1 ? 'Communes couvertes' : 'Commune couverte'} par une Base Adresse Locale`}
              value={numberCommunesWithoutTest}
            />
          )}

          {basesLocalesDepartementWithoutTest.length > 0 && (
            <Pane display='flex' flexDirection='column' alignItems='center' >
              <Counter
                label={`${basesLocalesDepartementWithoutTest.length > 1 ? 'Bases Adresses Locales' : 'Base Adresse Locale'}`}
                value={basesLocalesDepartementWithoutTest.length} />
              <PieChart height={240} data={BALByStatus} />
            </Pane>
          )}

          <Pane>
            <Heading size={500} marginY={8}>Liste des Base Adresse Locale</Heading>
            {filteredCommunesInBAL.map(({code, nom}, key) => (
              <Pane key={code} background={key % 2 ? 'tin1' : 'tint2'}>
                <CommuneBALList
                  key={code}
                  nomCommune={nom}
                  basesLocales={BALGroupedByCommune[code]}
                />
              </Pane>
            ))}
          </Pane>
        </Pane>
      ) : (
        <Heading marginTop={16} textAlign='center' size={600}>
          Aucune Base Adresse Locale
        </Heading>
      )}
    </DashboardLayout>
  )
}

Departement.getInitialProps = async ({query}) => {
  const {codeDepartement} = query

  const contoursCommunes = await getContoursCommunes()
  const departement = await getDepartement(codeDepartement)
  const basesLocalesDepartement = await listBALByCodeDepartement(codeDepartement)
  const basesLocalesDepartementWithoutTest = basesLocalesDepartement.filter((({isTest}) => !isTest))

  await expandWithPublished(basesLocalesDepartementWithoutTest)

  const BALAddedOneCodeCommune = flatten(basesLocalesDepartement.map(b => b.communes.map(c => ({...b, commune: c}))))
  const BALGroupedByCommune = groupBy(BALAddedOneCodeCommune, 'commune')

  const communesActuelles = flatten(await Promise.all(Object.keys(BALGroupedByCommune).map(async c => {
    const communes = await searchCommunesByCode(c)
    return communes
  })))

  const filteredCommunesInBAL = communesActuelles.filter(({code}) => Object.keys(BALGroupedByCommune).includes(code))

  return {
    departement,
    filteredCommunesInBAL,
    contoursCommunes,
    basesLocalesDepartement,
    basesLocalesDepartementWithoutTest,
    BALGroupedByCommune,
    layout: 'fullscreen'
  }
}

Departement.propTypes = {
  departement: PropTypes.object.isRequired,
  filteredCommunesInBAL: PropTypes.array.isRequired,
  basesLocalesDepartement: PropTypes.array.isRequired,
  basesLocalesDepartementWithoutTest: PropTypes.array.isRequired,
  BALGroupedByCommune: PropTypes.object.isRequired,
  contoursCommunes: PropTypes.object.isRequired
}

export default Departement
