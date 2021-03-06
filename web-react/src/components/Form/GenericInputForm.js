import React, { useEffect, useState, useMemo } from 'react'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { Calendar } from 'primereact/calendar'
import { Checkbox } from 'primereact/checkbox'
import { classNames } from 'primereact/utils'
import { Fragment } from 'react'
import { FieldType } from '../../common/enums'

import { InputTextarea } from 'primereact/inputtextarea'
import { ConvertToUTC } from '../../helpers/DateHelper'
import { OptionListService } from '../../services/OptionListService'
import { DisplayFormikDebugState } from '../../helpers/FormikHelper'
import { IS_DEBUG_FORM_ENABLED } from '../../common/constants'
import { useQuery, gql } from '@apollo/client'
import { useInjection } from 'inversify-react'
import { TabView, TabPanel } from 'primereact/tabview'
import { SimpleTable } from '../GenericTable/SimpleTable'

const ToInputField = (col, formik, optionsList) => {
  // const [optionsList, setOptionsList] = useState([])
  // // let optionsList = _optionListService.getOptionsList()
  // useEffect(() => {
  //   setOptionsList(_optionListService.getOptionsList())
  // //   optionListService.getShootingMediums().then((data) => setShootingMediums(data))
  // }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Don't show hidden fields
  if (col.hidden) {
    return <Fragment></Fragment>
  }

  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name])
  const getFormErrorMessage = (name) => {
    return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>
  }

  switch (col.type) {
    case FieldType.BOOLEAN:
      return (
        <Fragment>
          <div className="p-field-checkbox">
            <Checkbox
              inputId={col.field}
              name={col.field}
              checked={formik.values[col.field]}
              onChange={formik.handleChange}
              className={classNames({
                'p-invalid': isFormFieldValid(col.field),
              })}
            />
            <label
              htmlFor={col.field}
              className={classNames({
                'p-error': isFormFieldValid(col.field),
              })}
            >
              {col.header}
            </label>
          </div>
        </Fragment>
      )

    case FieldType.DATE:
      return (
        <Fragment>
          <span className="p-float-label">
            <Calendar
              id={col.field}
              name={col.field}
              value={formik.values[col.field] == null ? null : new Date(formik.values[col.field])}
              onChange={(newValue) => {
                formik.setFieldValue(col.field, ConvertToUTC(newValue.value))
              }}
              dateFormat="dd/mm/yy"
              mask="99/99/9999"
              showIcon
            />
            <label htmlFor={col.field}>{col.header}</label>
          </span>
        </Fragment>
      )
    case FieldType.DROPDOWN:
      return (
        <Fragment>
          <span className="p-float-label">
            <Dropdown id={col.field} name={col.field} value={optionsList[col.options] ? optionsList[col.options].find((option) => option.value == formik.values[col.field])?.value : ''} onChange={(option) => formik.setFieldValue(col.field, option.value)} options={optionsList[col.options]} optionLabel="label" />
            <label htmlFor={col.field}>{col.header}</label>
          </span>
        </Fragment>
      )
    case FieldType.EMAIL:
      return (
        <Fragment>
          <span className="p-float-label p-input-icon-right">
            <i className="pi pi-envelope" />
            <InputText
              id={col.field}
              name={col.field}
              value={formik.values[col.field]}
              onChange={formik.handleChange}
              className={classNames({
                'p-invalid': isFormFieldValid(col.field),
              })}
            />
            <label
              htmlFor={col.field}
              className={classNames({
                'p-error': isFormFieldValid(col.field),
              })}
            >
              Email*
            </label>
          </span>
          {getFormErrorMessage(col.field)}
        </Fragment>
      )
    case FieldType.TEXTAREA:
      return (
        <Fragment>
          <span className="p-float-label">
            <InputTextarea
              id={col.field}
              name={col.field}
              value={formik.values[col.field]}
              onChange={formik.handleChange}
              className={classNames({
                'p-invalid': isFormFieldValid(col.field),
              })}
            />
            <label
              htmlFor={col.field}
              className={classNames({
                'p-error': isFormFieldValid(col.field),
              })}
            >
              {col.header}
            </label>
          </span>
          {getFormErrorMessage(col.field)}
        </Fragment>
      )
    case FieldType.FLOAT:
      return (
        <Fragment>
          <span className="p-float-label">
            <InputNumber
              id={col.field}
              name={col.field}
              mode="decimal"
              maxFractionDigits={2}
              value={formik.values[col.field]}
              onValueChange={formik.handleChange}
              showButtons
              // buttonLayout="horizontal"
              className={classNames({
                'p-invalid': isFormFieldValid(col.field),
              })}
            />
            <label
              htmlFor={col.field}
              className={classNames({
                'p-error': isFormFieldValid(col.field),
              })}
            >
              {col.header}
            </label>
          </span>
          {getFormErrorMessage(col.field)}
        </Fragment>
      )
    case FieldType.DURATION:
      return (
        <Fragment>
          <span className="p-float-label">
            <InputNumber
              id={col.field}
              name={col.field}
              mode="decimal"
              maxFractionDigits={2}
              value={formik.values[col.field]}
              onValueChange={formik.handleChange}
              showButtons
              // buttonLayout="horizontal"
              className={classNames({
                'p-invalid': isFormFieldValid(col.field),
              })}
            />
            <label
              htmlFor={col.field}
              className={classNames({
                'p-error': isFormFieldValid(col.field),
              })}
            >
              {col.header}
            </label>
          </span>
          {getFormErrorMessage(col.field)}
        </Fragment>
      )
    case FieldType.INTEGER:
      return (
        <Fragment>
          <span className="p-float-label">
            <InputNumber
              id={col.field}
              name={col.field}
              mode="decimal"
              InputLabelProps={{ shrink: true }}
              maxFractionDigits={0}
              value={formik.values[col.field] || 0}
              onValueChange={formik.handleChange}
              showButtons
              useGrouping={false}
              className={classNames({
                'p-invalid': isFormFieldValid(col.field),
              })}
            />
            <label
              htmlFor={col.field}
              className={classNames({
                'p-error': isFormFieldValid(col.field),
              })}
            >
              {col.header}
            </label>
          </span>
          {getFormErrorMessage(col.field)}
        </Fragment>
      )
    case FieldType.CURRENCY:
      return (
        <Fragment>
          <span className="p-float-label">
            <InputNumber
              id={col.field}
              name={col.field}
              mode="currency"
              currency="USD"
              locale="en-US"
              value={formik.values[col.field]}
              onValueChange={formik.handleChange}
              className={classNames({
                'p-invalid': isFormFieldValid(col.field),
              })}
            />
            <label
              htmlFor={col.field}
              className={classNames({
                'p-error': isFormFieldValid(col.field),
              })}
            >
              {col.header}
            </label>
          </span>
          {getFormErrorMessage(col.field)}
        </Fragment>
      )
    default:
      return (
        <Fragment>
          <span className="p-float-label">
            <InputText
              id={col.field}
              name={col.field}
              value={formik.values[col.field]}
              onChange={formik.handleChange}
              className={classNames({
                'p-invalid': isFormFieldValid(col.field),
              })}
            />
            <label
              htmlFor={col.field}
              className={classNames({
                'p-error': isFormFieldValid(col.field),
              })}
            >
              {col.header}
            </label>
          </span>
          {getFormErrorMessage(col.field)}
        </Fragment>
      )
  }
}

// Display The Form
const ToInputForm = (cols, formik, isEdit, itemId) => {
  // Services
  // const _optionListService = useInjection(OptionListService)
  const _optionListService = new OptionListService()

  const filmListQuery = gql`
    query {
      films {
        id
        radiatorID
        titleInternational
      }
    }
  `

  const filmFestivalListQuery = gql`
    query {
      filmFestivals {
        id
        nameInternational
      }
    }
  `

const personProfessionListQuery = gql`
query {
  personProfessions {
    id
    name
  }
}
`

const peopleListQuery = gql`
query {
  people {
    id
    displayName
  }
}
`
  // Dropdowns
  const [aspectRatios, setAspectRatios] = useState([])
  const [countries, setCountries] = useState([])
  const [filmAges, setFilmAges] = useState([])
  const [filmGenres, setFilmGenres] = useState([])
  const [filmLengths, setFilmLengths] = useState([])
  const [filmStatuses, setFilmStatuses] = useState([])
  const [framerates, setFramerates] = useState([])
  const [premierRequirements, setPremierRequirements] = useState([])
  const [shootingMediums, setShootingMediums] = useState([])
  const [relationshipFilmSubmission, setRelationshipFilmSubmission] = useState([])
  const [films, setFilms] = useState([])
  const [filmFestivals, setFilmFestivals] = useState([])
  const [personProfessions, setPersonProfessions] = useState([])
  const [people, setPeople] = useState([])
  const filmResult = useQuery(filmListQuery)
  const filmFestivalResult = useQuery(filmFestivalListQuery)
  const personProfessionResult = useQuery(personProfessionListQuery)
  const peopleResult = useQuery(peopleListQuery)

  // If you absolutely need to cache the mutated data you can do the below. But
  // most of the time you won't need to use useMemo at all.
  const cachedMutatedDataFilm = useMemo(() => {
    if (filmResult.loading || filmResult.error) return null
    // mutate data here
    setFilms(filmResult.data.films.map((d) => ({ label: d.titleInternational, value: d.id })))
    return filmResult.data
  }, [filmResult.loading, filmResult.error, filmResult.data])

  const cachedMutatedDataFilmFestival = useMemo(() => {
    if (filmFestivalResult.loading || filmFestivalResult.error) return null
    // mutate data here
    setFilmFestivals(filmFestivalResult.data.filmFestivals.map((d) => ({ label: d.nameInternational, value: d.id })))
    return filmFestivalResult.data
  }, [filmFestivalResult.loading, filmFestivalResult.error, filmFestivalResult.data])

  const cachedMutatedDataPersonProfression = useMemo(() => {
    if (personProfessionResult.loading || personProfessionResult.error) return null
    // mutate data here
    setPersonProfessions(personProfessionResult.data.personProfessions.map((d) => ({ label: d.name, value: d.id })))
    return personProfessionResult.data
  }, [personProfessionResult.loading, personProfessionResult.error, personProfessionResult.data])

  const cachedMutatedDataPeople = useMemo(() => {
    if (peopleResult.loading || peopleResult.error) return null
    // mutate data here
    setPeople(peopleResult.data.people.map((d) => ({ label: d.displayName, value: d.id })))
    return peopleResult.data
  }, [peopleResult.loading, peopleResult.error, peopleResult.data])

  // const optionListService = new OptionListService()
  useEffect(() => {
    _optionListService.getAspectRatios().then((data) => setAspectRatios(data))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    _optionListService.getCountries().then((data) => setCountries(data))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    _optionListService.getFilmAges().then((data) => setFilmAges(data))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    _optionListService.getFilmGenres().then((data) => setFilmGenres(data))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    _optionListService.getFilmLengths().then((data) => setFilmLengths(data))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    _optionListService.getFilmStatuses().then((data) => setFilmStatuses(data))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    _optionListService.getFramerates().then((data) => setFramerates(data))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    _optionListService.getPremierRequirements().then((data) => setPremierRequirements(data))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    _optionListService.getShootingMediums().then((data) => setShootingMediums(data))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    _optionListService.getRelationshipFilmSubmission().then((data) => setRelationshipFilmSubmission(data))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const optionsList = {
    aspectRatios: aspectRatios,
    countries: countries,
    filmAges: filmAges,
    filmGenres: filmGenres,
    filmLengths: filmLengths,
    filmStatuses: filmStatuses,
    framerates: framerates,
    premierRequirements: premierRequirements,
    shootingMediums: shootingMediums,
    relationshipFilmSubmission: relationshipFilmSubmission,
    films: films,
    filmFestivals: filmFestivals,
    personProfessions: personProfessions,
    people: people,
  }
  let stop_loop = false
  let result = cols.map((colgroup, idxgroup) => {
    if (colgroup.colGroup && !colgroup.isRelationship)
      return (
        <TabPanel key={colgroup.field} header={colgroup.colGroup + (colgroup.isRelationship ? ' (relationship)' : '')} disabled={colgroup.isRelationship && !isEdit}>
          {
            (
            stop_loop = false,
            cols
              .filter((col, idx) => idx >= idxgroup)
              .map((col) => {
                if (stop_loop || (col.colGroup && col.colGroup != colgroup.colGroup)) {
                  stop_loop = true
                  return (null)// Break from loop
                }
                return (
                  <Fragment key={col.field}>
                    <div className="p-field">{ToInputField(col, formik, optionsList)}</div>
                  </Fragment>
                )
              }))
          }
        </TabPanel>
      )

    if (colgroup.isRelationship)
          return (
            <TabPanel key={colgroup.field} header={colgroup.colGroup + (colgroup.isRelationship ? ' (relationship)' : '')} disabled={colgroup.isRelationship && !isEdit}>
              {SimpleTable(colgroup.queries, colgroup.models, colgroup.colGroup + (colgroup.isRelationship ? ' (relationship)' : ''), itemId)}
            </TabPanel>
          )

    return (null);
  })

  return result.filter(_ => _ != null)

}

export const GenericInputForm = (cols, formik, isEdit, itemId) => (
  <div className="form-demo">
    <div className="p-d-flex p-jc-center">
      <div className="card">
        <form onSubmit={formik.handleSubmit} className="p-fluid">
          <TabView>{ToInputForm(cols, formik, isEdit, itemId)}</TabView>
        </form>
      </div>
      {IS_DEBUG_FORM_ENABLED && <DisplayFormikDebugState {...formik} />}
    </div>
  </div>
)
