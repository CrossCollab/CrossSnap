# CrossSnap

## A mobile app for completing crossword puzzles with your friends. 

CrossSnap is a fully functional and feature rich sull stack mobile game that allows people to complete crosswords in real-time with their friends. 

This project was built using Expo, React Native, Node.js, Express.js, and PostgreSQL. 

To see a video of the pojrect, please check out https://www.youtube.com/watch?v=dNaaMAr8DrE&list=PLx0iOsdUOUmkGPFdAt5kHKxGQw_YseAQI&index=19. 

## Key Features

 * Can transform archived puzzles into playable game boards. 
 * Live real-time gameplay with friends (set up your own game session, easy to share and join games using game codes). 
 * Smooth board navigation, (e.g. skip to next/previous word), managed with React refs. 
 * User login persistence using AsyncStorage. 

## Running from source

Clone this repository. You must have expo installed on your machine and mobile device (iPhone, iPad, Android). Also, you must have node and npm installed globally on your machine.

Installation:

`npm install`

Create and Seed Database:

`create database named: 'crosscollab'`

`also: update serverURL.js file with your IP address`

Start application on your computer:
`npm run server`

`npm run start`

To open game on your iPhone/mobile device: using your phone's camera, look at the QR code in your terminal, then press open in expo`

## Gameplay

See it here: https://www.youtube.com/watch?v=dNaaMAr8DrE&list=PLx0iOsdUOUmkGPFdAt5kHKxGQw_YseAQI&index=19

## Project Information

This app was built as a three-week capstone project for three students at [Fullstack Academy](https://www.fullstackacademy.com) in Chicago. The goal of this project was to deepen our understanding of the web technologies we learned and apply them to create a fun, functional, real world application.

