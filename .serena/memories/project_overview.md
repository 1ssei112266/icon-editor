# Icon Editor Project Overview

## Purpose
WordPress-integrated React icon customizer that allows users to create and customize icons with different shapes, sizes, and background colors. Designed to be embedded in WordPress sites via shortcode `[icon_customizer]`.

## Tech Stack
- React 19 + Vite + TypeScript
- Mantine UI v8.2.4 for components
- html2canvas for PNG export
- Previously used Tailwind CSS (now migrated to Mantine)

## Current Status
- Phase 1 COMPLETED: Basic functionality with admin image selection and PNG download
- Phase 2 NEXT: WordPress admin integration
- Phase 3 FUTURE: UX improvements and advanced features

## Architecture
- WordPress admins register images via admin panel
- End users select from registered images and customize them
- Frontend provides customization tools (color, shape, size)
- PNG export via html2canvas with CORS support