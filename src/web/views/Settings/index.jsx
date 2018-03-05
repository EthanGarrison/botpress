import React from 'react'
import {
  Form,
  FormGroup,
  FormControl,
  Checkbox,
  Button,
  Panel,
  Grid,
  Row,
  Col,
  ControlLabel,
  Link,
  Nav,
  NavItem
} from 'react-bootstrap'

import _ from 'lodash'
import { connect } from 'react-redux'

import ContentWrapper from '~/components/Layout/ContentWrapper'
import PageHeader from '~/components/Layout/PageHeader'
import ModulesComponent from '~/components/Modules'

import { fetchModules } from '~/actions'

class DashboardView extends React.Component {
  state = {
    loading: true
  }

  componentDidMount() {
    this.props.fetchModules().finally(() => this.setState({ loading: false }))
  }

  renderInput(option, optionName) {
    if (option.type === 'bool') {
      return <Checkbox>{optionName}</Checkbox>
    } else {
      return <FormControl type="text" placeholder={String(option.default)} />
    }
  }

  render() {
    if (this.state.loading) {
      return null
    }

    const { modules, location } = this.props
    const currentModule = modules.find(({ name }) => name === location.hash.substring(1)) || modules[0]
    console.log(currentModule.options)

    return (
      <Grid fluid>
        <PageHeader>
          <span>Settings</span>
        </PageHeader>
        <Row>
          <Col xs={3} md={2}>
            <h2>Core</h2>
            <Nav bsStyle="pills" stacked style={{ marginTop: '20px' }}>
              <NavItem eventKey={'flows'} href="/settings#flows">
                Flows
              </NavItem>
              <NavItem eventKey={'content'} href="/settings#content">
                Content
              </NavItem>
              <NavItem eventKey={'version-control'} href="/settings#version-control">
                Version Control
              </NavItem>
            </Nav>
            <h2>Modules</h2>
            <Nav bsStyle="pills" stacked activeHref={`/settings#${currentModule.name}`}>
              {modules.map(module => (
                <NavItem eventKey={module.name} key={module.name} href={`/settings#${module.name}`}>
                  {module.menuText}
                </NavItem>
              ))}
            </Nav>
          </Col>
          <Col xs={9} md={10}>
            <ContentWrapper>
              <Panel>
                <Panel.Body>
                  {Object.keys(currentModule.options).length === 0 ? (
                    'No editable options found for this module'
                  ) : (
                    <Form horizontal>
                      {_.map(currentModule.options, (option, optionName) => {
                        return (
                          <FormGroup key={optionName} controlId={`formHorizontal${option}`}>
                            <Col componentClass={ControlLabel} sm={4} style={{ wordWrap: 'break-word' }}>
                              {option.type === 'bool' ? null : `${optionName}${option.required ? ' *' : ''}`}
                            </Col>
                            <Col sm={8}>{this.renderInput(option, optionName)}</Col>
                          </FormGroup>
                        )
                      })}
                      <FormGroup>
                        <Col smOffset={4} sm={8}>
                          <Button type="submit">Save & Restart Bot</Button>
                        </Col>
                      </FormGroup>
                    </Form>
                  )}
                </Panel.Body>
              </Panel>
            </ContentWrapper>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default connect(({ modules }) => ({ modules }), { fetchModules })(DashboardView)
