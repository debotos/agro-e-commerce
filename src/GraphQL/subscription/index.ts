import { PubSub } from 'apollo-server'

import * as MESSAGE_EVENTS from './message'
import * as ORDER_EVENTS from './order'

export const EVENTS = {
	MESSAGE: MESSAGE_EVENTS,
	ORDER: ORDER_EVENTS
}

/* publisher-subscriber mechanism (PubSub) */
export default new PubSub()
