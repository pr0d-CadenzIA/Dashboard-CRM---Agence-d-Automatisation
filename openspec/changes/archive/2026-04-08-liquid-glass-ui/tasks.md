## 1. Fond global et variables CSS

- [x] 1.1 Modifier `src/index.css` : ajouter les blobs de couleur animés en arrière-plan (`@keyframes blob-move`), respecter `prefers-reduced-motion`
- [x] 1.2 Ajouter la classe utilitaire `.glass-card` dans `src/index.css` (backdrop-blur, bg semi-transparent, bordure lumineuse, shadow)

## 2. Composants

- [x] 2.1 Modifier `src/components/ui/card.tsx` : appliquer `.glass-card` sur le composant `Card`
- [x] 2.2 Modifier `src/components/DashboardLayout.tsx` : header et nav en verre translucide
- [x] 2.3 Modifier `src/views/ImportView.tsx` : card d'import en verre, fond de page avec dégradé
- [x] 2.4 Modifier `src/views/FocusModeView.tsx` : table en verre (fond semi-transparent)
- [x] 2.5 Modifier `src/views/ExecutiveView.tsx` : vérifier la lisibilité des KPIs et graphiques sur fond verre

## 3. Vérification

- [x] 3.1 Vérifier la lisibilité de tous les textes sur les surfaces en verre (screenshot Playwright)
- [x] 3.2 Vérifier la responsivité mobile avec le skill `webapp-testing`
