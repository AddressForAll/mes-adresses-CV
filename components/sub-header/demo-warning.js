import React, {useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'
import {Pane, Text, Button, Icon, Dialog, TextInputField} from 'evergreen-ui'

import Router from 'next/router'
import {useInput} from '../../hooks/input'
import useFocus from '../../hooks/focus'

import {getCommune} from '../../lib/geo-api'
import {updateBaseLocale} from '../../lib/bal-api'

const DemoWarning = ({baseLocale, token}) => {
  const {communes} = baseLocale
  const [isShown, setIsShown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [defaultCommune, setDefaultCommune] = useState()
  const [nom, onNomChange] = useInput()
  const [email, onEmailChange] = useInput()
  const focusRef = useFocus()

  const onSubmit = useCallback(async () => {
    setIsLoading(true)
    const bal = await updateBaseLocale(
      baseLocale._id,
      {
        isTest: false,
        nom: nom.trim(),
        emails: [email]
      },
      token
    )

    if (bal) {
      setIsLoading(false)
      setIsShown(false)
    }

    Router.push(`/bal/${bal._id}`)
  }, [baseLocale, token, email, nom])

  useEffect(() => {
    const fetchCommune = async code => {
      if (communes.length > 0) {
        setDefaultCommune(await getCommune(code))
      }
    }

    fetchCommune(communes[0])
  }, [communes])

  return (
    <Pane
      position='fixed'
      top={116}
      left={0}
      height={40}
      width='100%'
      backgroundColor='#F7D154'
      elevation={0}
      zIndex={3}
      display='flex'
      flexDirection='column'
      justifyContent='center'
    >
      <div
        style={{margin: 'auto', textAlign: 'center'}}
      >
        <Icon icon='warning-sign' size={20} marginX='.5em' style={{verticalAlign: 'sub'}} />
        <Text>
          Vous gérez actuellement une Base Adresse Locale de démonstration. Tous les changements peuvent être perdus.
        </Text>
        <Dialog
          isShown={isShown}
          title='Transformer en Base Adresse Locale'
          cancelLabel='Annuler'
          intent='success'
          isConfirmLoading={isLoading}
          confirmLabel={isLoading ? 'Chargement...' : 'Transformer'}
          hasFooter={false}
        >
          <form onSubmit={onSubmit}>

            <TextInputField
              required
              innerRef={focusRef}
              autoComplete='new-password' // Hack to bypass chrome autocomplete
              name='nom'
              id='nom'
              disabled={isLoading}
              value={nom}
              label='Nom de la Base Adresse Locale'
              placeholder={defaultCommune ? `Adresses de ${defaultCommune.nom}` : 'Nom'}
              onChange={onNomChange}
            />

            <TextInputField
              required
              type='email'
              name='email'
              id='email'
              disabled={isLoading}
              value={email}
              label='Votre adresse email'
              placeholder='nom@example.com'
              onChange={onEmailChange}
            />
            <Button appearance='primary' intent='success' type='submit' >{isLoading ? 'Chargement...' : 'Transformer'}</Button>
          </form>
        </Dialog>
        <Button height={24} marginX='.5em' onClick={() => setIsShown(true)}>Transformer en Base Adresse Locale</Button>
      </div>
    </Pane>
  )
}

DemoWarning.propTypes = {
  baseLocale: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired
}

export default DemoWarning
