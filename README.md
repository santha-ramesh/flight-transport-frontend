# SkyRoute Travel Platform

## Introduction
- Flight search and booking module for SkyRoute
- Supports search, sorting and booking workflows
- Implements GlobalAir and BudgetWings providers
- Built using a specification-first approach from spec.md
- Supports provider extensibility

## AI Tooling
- Tool: Claude
- Model: Haiku 4.5
- Usage: Generated initial architecture ideas and reviewed API contracts

## Architecture
Frontend
- Angular SPA

Backend
- ASP.NET Core Web API

Layers
1. API Layer (Controllers)
2. Business Layer (Services)
3. Data Access Layer (Provider Adapters)

External Provider Abstraction
- IFlightProvider
- GlobalAirProvider
- BudgetWingsProvider

Design Principles
- SOLID
- Dependency Injection
- Strategy Pattern for provider integrations

## Project Structure
backend/
frontend/
docs/

## Tech Stack
- .NET 10
- ASP.NET Core Web API
- Angular 19
- MSTest



