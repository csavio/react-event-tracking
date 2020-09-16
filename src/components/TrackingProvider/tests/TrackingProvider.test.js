/*
 * Copyright 2019 Expedia Group, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import {expect} from 'chai';
import {shallow, mount} from 'enzyme';
import TrackingProvider from '../TrackingProvider.js';
import sinon from 'sinon';

const PROP_DATA = {
    eventFields: {
        'datepicker.close': {
            'who': 'you'
        },
        'datepicker.open': {
            'who': 'you'
        },
        'datepicker.blur': {
            'when': 'today'
        }
    },
    eventOptions: {
        'datepicker.close': {
            'doitnow': 'yes'
        },
        'datepicker.open': {
            'doitnow': 'yes'
        },
        'datepicker.perf': {
            'pain': 'always'
        }
    },
    eventSchema: {
        'datepicker.close': {
            'schema_name': 'test',
        },
        'datepicker.open': {
            'schema_name': 'test',
        },
        'datepicker.perf': {
            'version': 1
        }
    },
    fields: {
        'location': 'top',
        'action': 'test',
        'language': 'english'
    },
    options: {
        'delay': '100',
        'jump': 'yolo'
    },
    schema: {
        'schema_name': 'foo',
        'version': 100
    }
};

const CONTEXT_DATA = {
    eventFields: {
        'datepicker.close': {
            'who': 'me'
        },
        'datepicker.open': {
            'who': 'me'
        },
        'generic.click': {
            'dummy': 'ohyeah'
        }
    },
    eventOptions: {
        'datepicker.close': {
            'doitnow': 'no'
        },
        'datepicker.open': {
            'doitnow': 'no'
        },
        'generic.event': {
            'waitforever': 'sure'
        }
    },
    eventSchema: {
        'datepicker.close': {
            'schema_name': 'another',
            'version': 2
        }
    },
    fields: {
        'location': 'bottom',
        'action': 'failure',
        'zombie': 'walking'
    },
    options: {
        'delay': '404',
        'up': 'down'
    },
    schema: {
        'schema_name': 'test',
        'version': 1
    }
};

const MERGED_DATA = {
    eventFields: {...CONTEXT_DATA.eventFields, ...PROP_DATA.eventFields},
    eventOptions: {...CONTEXT_DATA.eventOptions, ...PROP_DATA.eventOptions},
    eventSchema: {...CONTEXT_DATA.eventSchema, ...PROP_DATA.eventSchema},
    fields: {...CONTEXT_DATA.fields, ...PROP_DATA.fields},
    options: {...CONTEXT_DATA.options, ...PROP_DATA.options},
    schema: {...CONTEXT_DATA.schema, ...PROP_DATA.schema}
};

Object.keys(MERGED_DATA.eventFields).forEach((key) => {
    MERGED_DATA.eventFields[key] = {...CONTEXT_DATA.eventFields[key], ...PROP_DATA.eventFields[key]};
});
Object.keys(MERGED_DATA.eventOptions).forEach((key) => {
    MERGED_DATA.eventOptions[key] = {...CONTEXT_DATA.eventOptions[key], ...PROP_DATA.eventOptions[key]};
});
Object.keys(MERGED_DATA.eventSchema).forEach((key) => {
    MERGED_DATA.eventSchema[key] = {...CONTEXT_DATA.eventSchema[key], ...PROP_DATA.eventSchema[key]};
});


describe('<TrackingProvider/>', () => {
    const origWindow = global.window;

    afterEach(() => {
        global.window = origWindow;
    });

    describe('constructor', () => {
        it('should initialize TrackingContext with defaults', () => {
            const provider = shallow(<TrackingProvider />).instance();
            expect(provider.TrackingContext).to.deep.equal({
                _data: {
                    eventFields: undefined, // eslint-disable-line no-undefined
                    eventOptions: undefined, // eslint-disable-line no-undefined
                    eventSchema: undefined, // eslint-disable-line no-undefined
                    fields: undefined, // eslint-disable-line no-undefined
                    options: undefined, // eslint-disable-line no-undefined
                    schema: undefined, // eslint-disable-line no-undefined
                    trigger: provider.TrackingContext._data.trigger
                },
                hasProvider: true,
                trigger: provider.trigger
            });
            expect(typeof provider.TrackingContext._data.trigger).to.equal('function');
        });

        it('should initialize TrackingContext with specified properties', () => {
            const triggerStub = sinon.stub();
            const _data = {
                eventFields: {
                    myEvent: {
                        one: 'one',
                        two: 'two'
                    }
                },
                eventOptions: {
                    myEvent: {
                        three: 'four'
                    }
                },
                eventSchema: {
                    myEvent: {
                        schema_name: 'myEvent_schema_name'
                    }
                },
                fields: {
                    five: 'six',
                    seven: 'eight'
                },
                options: {
                    nine: 'ten'
                },
                schema: {
                    schema_name: 'schema_name'
                },
                trigger: triggerStub
            };

            const provider = shallow(<TrackingProvider {..._data}/>).instance();
            expect(provider.TrackingContext).to.deep.equal({
                _data,
                hasProvider: true,
                trigger: provider.trigger
            });
        });

        it('should initialize nested TrackingContext with specified properties', () => {
            const triggerStub = sinon.stub();
            const _data = {
                eventFields: {
                    myEvent: {
                        one: 'one',
                        two: 'two'
                    }
                },
                eventOptions: {
                    myEvent: {
                        three: 'three'
                    }
                },
                eventSchema: {
                    myEvent: {
                        five: 'five'
                    }
                },
                fields: {
                    five: 'five',
                    seven: 'seven'
                },
                options: {
                    nine: 'nine'
                },
                schema: {
                    version: 1
                },
                trigger: triggerStub
            };

            const _data2 = {
                eventFields: {
                    myEvent: {
                        one: 'one2',
                        three: 'three'
                    },
                    secondEvent: {
                        one: 'one',
                        two: 'two'
                    }
                },
                eventOptions: {
                    myEvent: {
                        three: 'four2',
                        four: 'four'
                    },
                    secondEvent: {
                        three: 'three',
                        four: 'four'
                    }
                },
                eventSchema: {
                    myEvent: {
                        five: 'five2',
                        six: 'six'
                    },
                    secondEvent: {
                        five: 'five',
                        six: 'six'
                    }
                },
                fields: {
                    five: 'six2',
                    eight: 'eight'
                },
                schema: {
                    schema_name: 'test'
                },
                options: {
                    nine: 'nine',
                    ten: 'ten'
                }
            };

            // This is ugly. Essentially need to deep merge to build the expected
            // data object but just doing this manually instead.
            const expectedData = JSON.parse(JSON.stringify(_data));
            Object.assign(expectedData.eventFields.myEvent, _data2.eventFields.myEvent);
            expectedData.eventFields.secondEvent = _data2.eventFields.secondEvent;
            Object.assign(expectedData.eventOptions, _data2.eventOptions);
            Object.assign(expectedData.eventSchema, _data2.eventSchema);
            Object.assign(expectedData.fields, _data2.fields);
            Object.assign(expectedData.options, _data2.options);
            Object.assign(expectedData.schema, _data2.schema);
            // Should inherit the parent trigger method.
            expectedData.trigger = triggerStub;

            const provider = mount(
                <TrackingProvider {..._data}>
                    <TrackingProvider {..._data2}/>
                </TrackingProvider>
            );
            const childProvider = provider.childAt(0).instance();
            expect(childProvider.TrackingContext).to.deep.equal({
                _data: expectedData,
                hasProvider: true,
                trigger: childProvider.trigger
            });
        });


        it('should initialize nested TrackingContext empty trigger if no trigger specified', () => {
            const provider = mount(
                <TrackingProvider>
                    <TrackingProvider/>
                </TrackingProvider>
            );
            const childProvider = provider.childAt(0).instance();
            expect(typeof childProvider.TrackingContext._data.trigger).to.equal('function');
        });
    });

    describe('mergeContextData', () => {
        it('should return the specified properties as the data if overwrite is true', () => {
            const provider = shallow(<TrackingProvider {...PROP_DATA} overwrite/>).instance();
            const result = provider.mergeContextData(CONTEXT_DATA);
            expect(result).to.deep.equal(PROP_DATA);
        });

        it('should return the context data if no data properties specified and overwrite is true', () => {
            const provider = shallow(<TrackingProvider overwrite/>).instance();
            const result = provider.mergeContextData(CONTEXT_DATA);
            expect(result).to.deep.equal(CONTEXT_DATA);
        });

        it('should return the context data if no data properties specified and overwrite is false', () => {
            const provider = shallow(<TrackingProvider/>).instance();
            const result = provider.mergeContextData(CONTEXT_DATA);
            expect(result).to.deep.equal(CONTEXT_DATA);
        });

        it('should return a merge of the specified properties and data if overwrite is false', () => {
            const provider = shallow(<TrackingProvider {...PROP_DATA}/>).instance();
            const result = provider.mergeContextData(CONTEXT_DATA);
            expect(result).to.deep.equal(MERGED_DATA);
        });

        it('should return the property data if overwrite is false and context data is null', () => {
            const provider = shallow(<TrackingProvider {...PROP_DATA}/>).instance();
            const result = provider.mergeContextData();
            expect(result).to.deep.equal(PROP_DATA);
        });
    });

    describe('trigger', () => {
        let triggerSpy = sinon.spy();

        afterEach(() => {
            triggerSpy.resetHistory();
        });

        it('should throw exception if event is not specified', () => {
            const provider = shallow(<TrackingProvider trigger={triggerSpy}/>).instance();
            expect(provider.trigger).to.throw('event is a required parameter');
        });

        it('should trigger an event with merged fields and options', () => {
            const event = 'datepicker.close';
            const provider = shallow(<TrackingProvider trigger={triggerSpy} eventFields={PROP_DATA.eventFields} eventOptions={PROP_DATA.eventOptions} fields={PROP_DATA.fields} options={PROP_DATA.options}/>).instance();
            provider.trigger(event, CONTEXT_DATA.fields, CONTEXT_DATA.options);
            expect(triggerSpy.calledOnce).to.equal(true);
            const args = triggerSpy.args[0];
            expect(args[0]).to.equal(event);
            expect(args[1]).to.deep.equal({...PROP_DATA.fields, ...PROP_DATA.eventFields[event], ...CONTEXT_DATA.fields});
            expect(args[2]).to.deep.equal({...PROP_DATA.options, ...PROP_DATA.eventOptions[event], ...CONTEXT_DATA.options});
        });
    });

    describe('renderProvider', () => {
        let triggerSpy = sinon.spy();

        afterEach(() => {
            triggerSpy.resetHistory();
        });

        it('should set this.TrackingContext._data to context data when no data passed', () => {
            const trackingProvider = shallow(<TrackingProvider trigger={triggerSpy} eventFields={PROP_DATA.eventFields} eventOptions={PROP_DATA.eventOptions} eventSchema={PROP_DATA.eventSchema} fields={PROP_DATA.fields} options={PROP_DATA.options} schema={PROP_DATA.schema}/>).instance();
            trackingProvider.renderProvider();
            expect(trackingProvider.TrackingContext._data).to.deep.equal({...PROP_DATA, trigger: triggerSpy});
        });

        it('should set this.TrackingContext._data to merge of context data', () => {
            const trackingProvider = shallow(<TrackingProvider trigger={triggerSpy} eventFields={PROP_DATA.eventFields} eventOptions={PROP_DATA.eventOptions} eventSchema={PROP_DATA.eventSchema} fields={PROP_DATA.fields} options={PROP_DATA.options} schema={PROP_DATA.schema}/>).instance();
            trackingProvider.renderProvider({_data: CONTEXT_DATA});
            expect(trackingProvider.TrackingContext._data).to.deep.equal({...MERGED_DATA, trigger: triggerSpy});
        });
    });

    describe('render', () => {
        it('should render successfully', () => {
            expect(shallow(<TrackingProvider/>)).to.have.length(1);
        });

        it('should render a ContextConsumer by default', () => {
            const provider = shallow(<TrackingProvider/>);
            expect(provider.find('ContextConsumer')).to.have.length(1);
        });
    });
});
