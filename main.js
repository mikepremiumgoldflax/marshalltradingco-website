/* ============================================================
   MARSHALL TRADING COMPANY — Main JavaScript
   Hamburger menu, badge removal, smooth interactions
   ============================================================ */

(function() {
    'use strict';

    // ========== HAMBURGER MENU ==========
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile nav when a link is clicked
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Keyboard accessibility for hamburger
        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                hamburger.click();
            }
        });
    }

    // ========== AGGRESSIVE BADGE REMOVAL ==========
    // Removes any injected badges, watermarks, or branding elements
    function removeBadges() {
        var selectors = [
            '[class*="manus"]',
            '[id*="manus"]',
            '[class*="badge"]',
            '[id*="badge"]',
            '[class*="watermark"]',
            '[id*="watermark"]',
            '[class*="branding"]',
            '[id*="branding"]',
            '[data-manus]',
            '[class*="powered-by"]',
            '[id*="powered-by"]',
            '[class*="made-with"]',
            '[id*="made-with"]',
            'a[href*="manus"]',
            'div[style*="position: fixed"][style*="bottom"]',
            'div[style*="position:fixed"][style*="bottom"]'
        ];

        selectors.forEach(function(selector) {
            try {
                var elements = document.querySelectorAll(selector);
                elements.forEach(function(el) {
                    // Don't remove our own elements
                    if (el.closest('.site-header') || el.closest('.site-footer') || 
                        el.closest('.hero') || el.closest('.main-nav') ||
                        el.closest('.mobile-nav-overlay')) {
                        return;
                    }
                    // Check if it looks like an injected badge
                    var text = (el.textContent || '').toLowerCase();
                    if (text.includes('manus') || text.includes('made with') || 
                        text.includes('powered by') || text.includes('badge')) {
                        el.remove();
                    }
                });
            } catch(e) {}
        });

        // Also check for fixed-position elements at the bottom of the page
        var allDivs = document.querySelectorAll('body > div, body > a, body > span, body > iframe');
        allDivs.forEach(function(el) {
            var style = window.getComputedStyle(el);
            if (style.position === 'fixed' && 
                (parseInt(style.bottom) < 50 || style.bottom === '0px') &&
                !el.closest('.site-header') && !el.closest('.mobile-nav-overlay')) {
                var text = (el.textContent || '').toLowerCase();
                if (text.includes('manus') || text.includes('made') || 
                    text.includes('powered') || el.querySelector('img') ||
                    el.children.length <= 2) {
                    el.remove();
                }
            }
        });
    }

    // Run badge removal immediately
    removeBadges();

    // Run again after DOM is fully loaded
    document.addEventListener('DOMContentLoaded', removeBadges);

    // Run after a short delay to catch late-injected elements
    setTimeout(removeBadges, 1000);
    setTimeout(removeBadges, 3000);
    setTimeout(removeBadges, 5000);

    // MutationObserver to catch dynamically injected elements
    var observer = new MutationObserver(function(mutations) {
        var shouldClean = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        var text = (node.textContent || '').toLowerCase();
                        var className = (node.className || '').toLowerCase();
                        var id = (node.id || '').toLowerCase();
                        
                        if (text.includes('manus') || text.includes('made with') ||
                            text.includes('powered by') || className.includes('manus') ||
                            className.includes('badge') || className.includes('watermark') ||
                            id.includes('manus') || id.includes('badge') ||
                            id.includes('watermark')) {
                            node.remove();
                            return;
                        }

                        // Check for fixed bottom elements
                        var style = window.getComputedStyle(node);
                        if (style.position === 'fixed' && parseInt(style.bottom) < 50) {
                            shouldClean = true;
                        }
                    }
                });
            }
        });
        if (shouldClean) {
            removeBadges();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========== HEADER SCROLL EFFECT ==========
    var header = document.querySelector('.site-header');
    var lastScroll = 0;

    window.addEventListener('scroll', function() {
        var currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
        } else {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        }
        lastScroll = currentScroll;
    });

})();
