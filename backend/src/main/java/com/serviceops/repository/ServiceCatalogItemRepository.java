package com.serviceops.repository;

import com.serviceops.entity.ServiceCatalogItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceCatalogItemRepository extends JpaRepository<ServiceCatalogItem, String> {
    List<ServiceCatalogItem> findByActiveTrue();
    List<ServiceCatalogItem> findByCategoryAndActiveTrue(String category);
}
