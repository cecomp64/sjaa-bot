// sjaa-bot

// Objectives
//   - Authenticate a user (e-mail) against SJAA membership spreadsheet

// Helpful links
//  https://discord.js.org/#/docs/discord.js/main/class/Client?scrollTo=e-messageCreate
import 'dotenv/config'
import {login} from '../samples/discord_login.js'
import { google_auth, read_spreadsheet } from './google_apis.js'

var client = await google_auth();
read_spreadsheet(process.env.MEMBERSHIP_SHEET_ID, client)

// Do the Discord Stuff
//login();
