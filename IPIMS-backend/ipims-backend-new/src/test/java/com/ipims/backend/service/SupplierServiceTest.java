package com.ipims.backend.service;

import com.ipims.backend.exception.ConflictException;
import com.ipims.backend.exception.ResourceNotFoundException;
import com.ipims.backend.model.Supplier;
import com.ipims.backend.repository.SupplierRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SupplierServiceTest {

    @Mock
    private SupplierRepository supplierRepository;

    @InjectMocks
    private SupplierService supplierService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getSupplierById_Found() {
        Supplier supplier = new Supplier();
        supplier.setId(1L);
        supplier.setSupplierName("Test Supplier");

        when(supplierRepository.findById(1L)).thenReturn(Optional.of(supplier));

        Supplier result = supplierService.getSupplierById(1L);
        assertEquals("Test Supplier", result.getSupplierName());
    }

    @Test
    void getSupplierById_NotFound() {
        when(supplierRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> supplierService.getSupplierById(1L));
    }

    @Test
    void createSupplier_Success() {
        Supplier supplier = new Supplier();
        supplier.setSupplierName("New Supplier");
        supplier.setEmail("new@test.com");

        when(supplierRepository.findBySupplierName("New Supplier")).thenReturn(Optional.empty());
        when(supplierRepository.findByEmail("new@test.com")).thenReturn(Optional.empty());
        when(supplierRepository.save(supplier)).thenReturn(supplier);

        Supplier result = supplierService.createSupplier(supplier);
        assertNotNull(result);
        verify(supplierRepository, times(1)).save(supplier);
    }

    @Test
    void createSupplier_DuplicateName() {
        Supplier supplier = new Supplier();
        supplier.setSupplierName("Existing");

        when(supplierRepository.findBySupplierName("Existing")).thenReturn(Optional.of(supplier));

        assertThrows(ConflictException.class, () -> supplierService.createSupplier(supplier));
    }
}
