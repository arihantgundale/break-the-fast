package com.breakthefast.config;

import com.breakthefast.entity.AdminUser;
import com.breakthefast.entity.MenuItem;
import com.breakthefast.enums.MenuCategory;
import com.breakthefast.repository.AdminUserRepository;
import com.breakthefast.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final MenuItemRepository menuItemRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-email}")
    private String adminEmail;

    @Value("${app.admin.default-password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedMenu();
    }

    private void seedAdmin() {
        if (adminUserRepository.existsByEmail(adminEmail)) {
            log.info("Admin user already exists: {}", adminEmail);
            return;
        }

        AdminUser admin = AdminUser.builder()
                .email(adminEmail)
                .passwordHash(passwordEncoder.encode(adminPassword))
                .name("Restaurant Owner")
                .build();
        adminUserRepository.save(admin);
        log.info("Default admin created: {}", adminEmail);
    }

    private void seedMenu() {
        if (menuItemRepository.count() > 0) {
            log.info("Menu already seeded. Skipping.");
            return;
        }

        log.info("Seeding sample menu data...");

        // ─── BREAKFAST ─────────────────────────────────────────
        createItem("Poha", "Flattened rice tempered with mustard seeds, turmeric, peanuts, and fresh curry leaves. A beloved Maharashtrian morning staple.",
                MenuCategory.BREAKFAST, "8.99", "12 oz", true, false,
                "Poha has been a cornerstone of Indian breakfast culture for centuries, originating in Maharashtra and Gujarat.",
                "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=600&h=400&fit=crop");

        createItem("Aloo Paratha", "Golden whole-wheat flatbread stuffed with spiced mashed potatoes, served with butter and yogurt.",
                MenuCategory.BREAKFAST, "10.99", "2 pieces", true, false,
                "Paratha tradition traces to the Mughal era, where stuffed breads were a royal breakfast delicacy.",
                "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop");

        createItem("Masala Dosa", "Crispy rice-lentil crepe filled with spiced potato masala, served with coconut chutney and sambar.",
                MenuCategory.BREAKFAST, "11.99", "1 dosa", true, false,
                "Dosa originated in South India over a thousand years ago and remains one of the most iconic vegetarian dishes globally.",
                "https://images.unsplash.com/photo-1668236543090-82bbe5ce830c?w=600&h=400&fit=crop");

        createItem("Upma", "Semolina cooked with vegetables, mustard seeds, and cashews. A comforting South Indian breakfast.",
                MenuCategory.BREAKFAST, "7.99", "10 oz", true, false,
                "Upma is a staple in Karnataka and Tamil Nadu, known for its simplicity and nutritional balance.",
                "https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&h=400&fit=crop");

        createItem("Idli Sambar", "Steamed rice cakes served with lentil-vegetable sambar and coconut chutney.",
                MenuCategory.BREAKFAST, "9.49", "4 pieces", true, false,
                "Idli is a fermented delicacy perfected over centuries in South Indian kitchens, celebrated for being light yet filling.",
                "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop");

        // ─── LUNCH THALI ───────────────────────────────────────
        createItem("North Indian Thali", "Complete platter: 2 curries, dal, rice, 3 rotis, raita, salad, pickle, and dessert.",
                MenuCategory.LUNCH_THALI, "16.99", "Full plate", true, false,
                "The thali represents the Indian philosophy of a balanced meal — all six tastes (sweet, sour, salty, bitter, pungent, astringent) on one plate.",
                "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop");

        createItem("South Indian Thali", "Rice, sambar, rasam, kootu, poriyal, papad, pickle, and payasam.",
                MenuCategory.LUNCH_THALI, "15.99", "Full plate", true, false,
                "South Indian thalis follow Ayurvedic principles, with each component contributing to digestive harmony.",
                "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop");

        createItem("Gujarati Thali", "A sweet-savory symphony: dal, kadhi, shak, rotli, rice, pickle, farsan, and sweet.",
                MenuCategory.LUNCH_THALI, "17.99", "Full plate", true, false,
                "Gujarat's thali tradition is legendary — every meal is a celebration of the state's rich vegetarian culinary heritage.",
                "https://images.unsplash.com/photo-1606491956689-2ea866880049?w=600&h=400&fit=crop");

        // ─── SNACKS & CHAAT ────────────────────────────────────
        createItem("Pani Puri", "Crispy hollow puris filled with spiced potato, chickpeas, and tangy mint water.",
                MenuCategory.SNACKS_CHAAT, "8.49", "8 pieces", true, true,
                "Pani Puri — known by different names across India — is the country's most beloved street food, dating back centuries.",
                "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop");

        createItem("Bhel Puri", "Puffed rice tossed with chutneys, sev, onions, and coriander. Mumbai's signature snack.",
                MenuCategory.SNACKS_CHAAT, "7.99", "8 oz", true, false,
                "Born on the beaches of Mumbai, Bhel Puri captures the spirit of India's street food revolution.",
                "https://images.unsplash.com/photo-1606491956689-2ea866880049?w=600&h=400&fit=crop");

        createItem("Samosa (2 pcs)", "Crispy pastry pyramids filled with spiced potatoes and peas, served with mint and tamarind chutneys.",
                MenuCategory.SNACKS_CHAAT, "6.99", "2 pieces", true, true,
                "The samosa traveled the Silk Road to India and became the country's most iconic snack.",
                "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop");

        createItem("Dahi Vada", "Soft lentil dumplings soaked in seasoned yogurt, topped with sweet and tangy chutneys.",
                MenuCategory.SNACKS_CHAAT, "8.99", "3 pieces", true, false,
                "Dahi Vada appears in ancient Indian texts and remains a festive favorite across every region.",
                "https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&h=400&fit=crop");

        // ─── SWEETS & DESSERTS ─────────────────────────────────
        createItem("Gulab Jamun", "Golden milk-solid dumplings soaked in rose-cardamom syrup. India's most loved dessert.",
                MenuCategory.SWEETS_DESSERTS, "6.99", "4 pieces", true, false,
                "Gulab Jamun traces its origins to Persian cuisine, perfected in Indian kitchens with milk-based kneading techniques.",
                "https://images.unsplash.com/photo-1666190050946-7b2e56db4262?w=600&h=400&fit=crop");

        createItem("Rasmalai", "Soft cottage cheese discs in chilled saffron-cardamom milk, garnished with pistachios.",
                MenuCategory.SWEETS_DESSERTS, "8.49", "3 pieces", true, false,
                "A Bengali masterpiece, Rasmalai showcases India's unparalleled expertise in milk-based confections.",
                "https://images.unsplash.com/photo-1571006694754-6a0ee05aee74?w=600&h=400&fit=crop");

        createItem("Kheer", "Slow-cooked rice pudding with saffron, cardamom, almonds, and raisins.",
                MenuCategory.SWEETS_DESSERTS, "5.99", "8 oz", true, false,
                "Kheer is one of the oldest Indian desserts, mentioned in Ayurvedic texts as both a delicacy and a healing food.",
                "https://images.unsplash.com/photo-1633383718081-22ac93e3db65?w=600&h=400&fit=crop");

        // ─── DINNER ────────────────────────────────────────────
        createItem("Paneer Tikka Masala", "Chargrilled paneer cubes in a rich tomato-cream sauce with aromatic spices.",
                MenuCategory.DINNER, "14.99", "12 oz", true, true,
                "Paneer Tikka Masala fuses tandoor-grilling traditions with Mughlai gravy mastery.",
                "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop");

        createItem("Dal Makhani", "Black lentils slow-cooked overnight with butter, cream, and a blend of warming spices.",
                MenuCategory.DINNER, "12.99", "12 oz", true, false,
                "Dal Makhani from Punjab is the epitome of comfort food — patience is its secret ingredient.",
                "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop");

        createItem("Vegetable Biryani", "Fragrant basmati rice layered with seasoned vegetables, saffron, and fried onions.",
                MenuCategory.DINNER, "13.99", "16 oz", true, true,
                "Biryani's origins span Persia and the Mughal courts, evolving into India's most celebrated rice dish.",
                "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop");

        createItem("Chole Bhature", "Spiced chickpea curry served with fluffy deep-fried bread.",
                MenuCategory.DINNER, "12.99", "1 plate", true, true,
                "A Punjabi street food legend, Chole Bhature is now a national favorite from Delhi's bustling lanes.",
                "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&h=400&fit=crop");

        // ─── CATERING ──────────────────────────────────────────
        createItem("Party Platter — Snacks", "Assorted samosas, pakoras, spring rolls, and chutneys. Perfect for events.",
                MenuCategory.CATERING, "49.99", "Serves 10-12", true, true,
                "Our catering platters bring the energy of Indian street food to your celebrations.",
                "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop");

        createItem("Party Platter — Sweets", "Assorted gulab jamun, rasmalai, barfi, and ladoo.",
                MenuCategory.CATERING, "59.99", "Serves 10-12", true, false,
                "Indian sweets have been the heart of every celebration for millennia.",
                "https://images.unsplash.com/photo-1666190050946-7b2e56db4262?w=600&h=400&fit=crop");

        createItem("Full Catering Thali Package", "Complete meal per person: appetizer, 2 curries, dal, rice, bread, dessert.",
                MenuCategory.CATERING, "24.99", "Per person (min 20)", true, false,
                "Our catering thali brings the full Indian dining experience to your event.",
                "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop");

        log.info("Menu seeding complete — {} items created", menuItemRepository.count());
    }

    private void createItem(String name, String description, MenuCategory category,
                             String price, String portionSize, boolean available, boolean spicy,
                             String heritageNote, String imageUrl) {
        MenuItem item = MenuItem.builder()
                .name(name)
                .description(description)
                .category(category)
                .price(new BigDecimal(price))
                .portionSize(portionSize)
                .imageUrl(imageUrl)
                .isAvailable(available)
                .isSpicy(spicy)
                .heritageNote(heritageNote)
                .displayOrder((int) menuItemRepository.count())
                .build();
        menuItemRepository.save(item);
    }
}
