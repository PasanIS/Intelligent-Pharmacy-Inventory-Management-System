package com.ipims.backend.service;

import com.ipims.backend.exception.ConflictException;
import com.ipims.backend.exception.ResourceNotFoundException;
import com.ipims.backend.model.Supplier;
import com.ipims.backend.repository.SupplierRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    public List<Supplier> getAllSuppliers() {
        log.info("Fetching all suppliers");
        return supplierRepository.findAll();
    }

    public Supplier getSupplierById(Long id) {
        log.info("Fetching supplier with ID: {}", id);
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found with ID: " + id));
    }

    public Supplier createSupplier(Supplier supplier) {
        log.info("Creating new supplier: {}", supplier.getSupplierName());
        if (supplierRepository.findBySupplierName(supplier.getSupplierName()).isPresent()) {
            throw new ConflictException("Supplier with name " + supplier.getSupplierName() + " already exists.");
        }
        if (supplierRepository.findByEmail(supplier.getEmail()).isPresent()) {
            throw new ConflictException("Supplier with email " + supplier.getEmail() + " already exists.");
        }
        return supplierRepository.save(supplier);
    }

    public Supplier updateSupplier(Long id, Supplier updatedSupplier) {
        log.info("Updating supplier with ID: {}", id);
        Supplier existingSupplier = getSupplierById(id);

        existingSupplier.setSupplierName(updatedSupplier.getSupplierName());
        existingSupplier.setContactPerson(updatedSupplier.getContactPerson());
        existingSupplier.setEmail(updatedSupplier.getEmail());
        existingSupplier.setPhoneNumber(updatedSupplier.getPhoneNumber());

        return supplierRepository.save(existingSupplier);
    }

    public void deleteSupplier(Long id) {
        log.info("Deleting supplier with ID: {}", id);
        if (!supplierRepository.existsById(id)) {
            throw new ResourceNotFoundException("Supplier not found for deletion with ID: " + id);
        }
        supplierRepository.deleteById(id);
    }
}
