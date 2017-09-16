import React, { Component } from 'react';
import { Card, CardText } from 'material-ui/Card';
import { translate, ViewTitle, SimpleForm, TextInput, Title} from 'admin-on-rest';
import { connect } from 'react-redux';
import { getConfig as getConfigAction, saveConfig as saveConfigAction } from './configReducer';
import { required, email } from 'admin-on-rest';
import compose from 'recompose/compose';

export class ConfigPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 0,
      conf: props.data,
    };
    this.previousKey = 0;
  }

  componentDidMount() {
    this.updateData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState({ record: nextProps.data });
      if (this.fullRefresh) {
        this.fullRefresh = false;
        this.setState({ key: this.state.key + 1 });
      }
    }
  }

  getBasePath() {
    const { location } = this.props;
    return location.pathname.split('/').slice(0, -1).join('/');
  }

  defaultRedirectRoute() {
    return 'config';
  }

  updateData() {
    // call function to get config reducer
    this.props.getConfig();
  }

  refresh = (event) => {
    event.stopPropagation();
    this.fullRefresh = true;
    this.updateData();
  }

  save = (data, redirect) => {
    // call function for updating config data
    this.props.saveConfig('data', data);
  }

  render() {
    const { resource, children, data, isLoading, title, translate } = this.props;
    const { key } = this.state;
    console.log(resource);
    const basePath = this.getBasePath();

    const defaultTitle = 'Configuration';
    // const defaultTitle = translate('aor.page.config', {
    //   name: 'Configuration',
    //   data,
    // });
    // const titleElement = data ? <Title title={title} record={data} defaultTitle={defaultTitle} /> : '';
    const titleElement = <Title title={title} record={data} defaultTitle={defaultTitle} />;
    const isRefreshing = key !== this.previousKey;
    this.previousKey = key;

    return (
      <div className="config-page">
        <Card style={{opacity: isLoading ? 0.8 : 1 }} key={key}>
          <ViewTitle title={titleElement} />
          {data && !isRefreshing && React.cloneElement(children, {
            save: this.save,
            resource,
            basePath,
            record: data,
            translate,
            redirect: typeof children.props.redirect === 'undefined' ? this.defaultRedirectRoute() : children.props.redirect,
          })}
          {!data && <CardText>&nbsp;</CardText>}
        </Card>
      </div>
    );
  }
}

const Config = (props) => (
  <ConfigPage title='Configuration' {...props}>
    <SimpleForm submitOnEnter={false}>
      <TextInput source='paypal_email' type='email' validate={[ required, email ]} />
      <TextInput source='notif_email' type='email' validate={[ required, email ]} />

    </SimpleForm>
  </ConfigPage>
);

function mapStateToProps(state, props) {
  console.log(state, props);
  return {
    data: state.config.data,
    isLoading: state.admin.loading > 0,
  }
}

const enhance = compose(
  connect(
    mapStateToProps, {
      getConfig: getConfigAction,
      saveConfig: saveConfigAction,
    },
  ),
  translate
);

export default enhance(Config);
